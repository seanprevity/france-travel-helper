import openai
import os
from dotenv import load_dotenv
from flask import current_app

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

def get_description(town_name, department_name, region_name, lang="en"):
    current_app.logger.info(f"Town Information: Town: {town_name}, Dept: {department_name}, Region:{region_name}, lang={lang}")
    prompt = f"""Provide information about {town_name}, located in the {department_name} department of the {region_name} region of France in this EXACT format:

DESCRIPTION: [2-3 sentence travel-friendly description]

ATTRACTIONS:
1. [Name] - [Brief reason]
2. [Name] - [Brief reason]
3. [Name] - [Brief reason]"""

    if lang == "fr":
        prompt = f"""Fournir des informations sur {town_name}, situé dans le département {department_name} de la région {region_name} en France dans ce format EXACT:

DESCRIPTION: [Description touristique en 2-3 phrases]

ATTRACTIONS:
1. [Nom] - [Raison courte]
2. [Nom] - [Raison courte]
3. [Nom] - [Raison courte]"""

    response = openai.chat.completions.create(
        model="gpt-4.1-nano",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7
    )

    return response.choices[0].message.content.strip()
