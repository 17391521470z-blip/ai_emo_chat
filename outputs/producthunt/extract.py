import json
import urllib.request
import re

slugs = ['mailwarm', 'astra-security', 'empromptu', 'gemma-4-12b', 'build-club']
results = []

for slug in slugs:
    url = f"https://hunted.space/dashboard/{slug}"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            html = response.read().decode('utf-8')
            match = re.search(r'<script id="__NEXT_DATA__" type="application/json">(.*?)</script>', html)
            if match:
                data = json.loads(match.group(1))
                post = data['props']['pageProps']['post']
                results.append({
                    'name': post.get('name'),
                    'tagline': post.get('tagline'),
                    'description': post.get('description'),
                    'url': f"https://www.producthunt.com/products/{slug}",
                    'votes': post.get('votesCount'),
                    'rank': post.get('dailyRank')
                })
    except Exception as e:
        print(f"Error for {slug}: {e}")

with open('/workspace/outputs/producthunt/data.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, ensure_ascii=False, indent=2)
print("Done")
