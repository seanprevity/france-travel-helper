import openai
import os
from dotenv import load_dotenv
from flask import current_app

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

def get_description(town_name, department_name, region_name, lang="en"):
    prompt = f"""
Provide detailed and engaging information about {town_name}, located in the {department_name} department of the {region_name} region of France. Use the following format exactly:

DESCRIPTION:
[2-3 sentence overview tailored for travelers — include what makes the town charming, unique, or appealing to visitors.]

HISTORY:
[2-3 sentences briefly outlining the town’s historical background or notable past events. Mention any known heritage, ancient settlements, or historical figures if applicable.]

ATTRACTIONS:
1. [Name] – [Short reason to visit or its significance]
2. [Name] – [Short reason to visit or its significance]
3. [Name] – [Short reason to visit or its significance]
"""

    if lang == "fr":
        prompt = f"""Fournissez des informations détaillées et attrayantes sur {town_name}, située dans le département {department_name} de la région {region_name} de France. Utilisez exactement le format suivant :

DESCRIPTION:  
[aperçu de 2 à 3 phrases adapté aux voyageurs — incluez ce qui rend la ville charmante, unique ou attrayante pour les visiteurs.]

HISTORY:  
[2 à 3 phrases décrivant brièvement le passé historique de la ville ou des événements notables. Mentionnez tout patrimoine, établissements anciens ou personnages historiques le cas échéant.]

ATTRACTIONS:  
1. [Nom] – [Brève raison de la visite ou de son importance]  
2. [Nom] – [Brève raison de la visite ou de son importance]  
3. [Nom] – [Brève raison de la visite ou de son importance]
"""

    response = openai.chat.completions.create(
        model="gpt-4.1-nano",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7
    )

    return response.choices[0].message.content.strip()
