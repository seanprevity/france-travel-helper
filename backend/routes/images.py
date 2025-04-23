import requests
from flask import current_app
import re
import random

def fetch_wiki_images(town_name, department_name, lang="fr", thumb_width=1200, extra=10, max_fetch=500):
    def _gather_for(title_to_use):
        S   = requests.Session()
        API = f"https://{lang}.wikipedia.org/w/api.php"
        blocklist = {
            "armoiries","blason","logo","drapeau","flag","coat_of_arms",
            "emblème","symbol","badge","map","carte","plan","banner","coat",
            "textes", "texte", "allemands", "banc", "coupe", "graphique",
            "illustration"
        }
        allowlist = {
            "eglise","église","chateau","château","jardin","place","rue",
            "pont","mairie","panorama","vue","paysage","montagne","plage",
            "rivière","lac","skyline","aérien","aerial","panoramique",
            "ville","tour","historique","centre-ville","vieux","vieille",
            "naturelle","l'église","halle","monument","statue","tower",
            "arc","champs","louvre","museum", "city"
        }
        token     = town_name.lower().replace(" ", "_")
        results, seen = [], set()

        # 1) Infobox thumbnail
        try:
            p = S.get(API, params={
                "action":"query",
                "format":"json",
                "titles":title_to_use,
                "prop":"pageimages",
                "piprop":"thumbnail",
                "pithumbsize":thumb_width
            }, timeout=5).json()["query"]["pages"]
            
            for pg in p.values():
                thumb = pg.get("thumbnail",{}).get("source")
                if thumb and thumb not in seen:
                    results.append({"url":thumb,"description":None,"primary":True})
                    seen.add(thumb)
                break
        except Exception as e:
            current_app.logger.error(f"Infobox error for {title_to_use}: {e}")

        # 2) Collect image titles
        titles = []
        try:
            img_page = S.get(API, params={
                "action":"query",
                "format":"json",
                "titles":title_to_use,
                "prop":"images",
                "imlimit":max_fetch
            }, timeout=5).json()["query"]["pages"]
            for pg in img_page.values():
                for img in pg.get("images",[]):
                    t = img["title"]
                    if t.lower().endswith((".jpg",".jpeg",".png")):
                        titles.append(t)
        except Exception as e:
            current_app.logger.error(f"Title collection error for {title_to_use}: {e}")

        # 3) Fetch imageinfo in batches
        for i in range(0, len(titles), 50):
            chunk = titles[i:i+50]
            try:
                info = S.get(API, params={
                    "action":"query", 
                    "format":"json", 
                    "titles":"|".join(chunk),
                    "prop":"imageinfo", 
                    "iiprop":"url|thumburl|extmetadata",
                    "iiurlwidth":thumb_width
                }, timeout=5).json()["query"]["pages"]
                
                for pg in info.values():
                    ii    = pg["imageinfo"][0]
                    thumb = ii.get("thumburl") or ii.get("url")
                    name  = pg["title"].lower().replace("file:","")
                    if not thumb or thumb in seen: continue
                    if any(bl in name for bl in blocklist): continue
                    if not (token in name or any(kw in name for kw in allowlist)):
                        continue

                    raw  = (ii.get("extmetadata",{}).get("ImageDescription",{}).get("value",""))
                    text = re.sub(r"<[^>]+>","", raw).strip()
                    if any(bl in text.lower() for bl in blocklist):
                        continue

                    results.append({"url":thumb,"description":text or None,"primary":False})
                    seen.add(thumb)
            except Exception as e:
                current_app.logger.error(f"Imageinfo error for {title_to_use}: {e}")

        # sort primaries first, then trim
        final = sorted(results, key=lambda x: not x["primary"])
        limit = extra + 5
        
        primaries = [img for img in final if img["primary"]]
        others = [img for img in final if not img["primary"]]
        if len(final) > limit:
            slots = max(limit - len(primaries), 0)
            sampled = random.sample(others, slots) if slots > 0 and others else [] 
            random.shuffle(sampled)
            chosen = primaries + sampled
        else:
            chosen = final

        current_app.logger.info(
            f"Randomly selected {len(chosen)} images for {title_to_use}"
        )
        return chosen

    # find images with wiki/town then wiki/town_(dept) if nothing from first link
    images = _gather_for(town_name)
    if not images:
        fallback = f"{town_name.replace(' ', '_')}_({department_name.replace(' ', '_')})"
        current_app.logger.info(f"No images under '{town_name}', retrying '{fallback}'")
        images = _gather_for(fallback)

    return {"images": images}
