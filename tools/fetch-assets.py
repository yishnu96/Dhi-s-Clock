from pathlib import Path
import urllib.request, json, subprocess
from concurrent.futures import ThreadPoolExecutor

root=Path(__file__).resolve().parents[1]
assets=root/'assets'
items={
 'clock':'408f91_625b37ec60c94a1eb73d528b8c6d957d~mv2.jpg',
 'gallery-1':'408f91_9535dbb5f16f4e768a3a4e4c7c1753be~mv2.png',
 'gallery-2':'408f91_7b053395dc594b169115fa8acbae45ba~mv2.png',
 'logo-story-1':'408f91_1867e95ab5a240fc9cb363b7376845b5~mv2.png',
 'logo-story-2':'408f91_cd2d95a270174b4795cd3e8056074491~mv2.png',
 'recognition-1':'408f91_b05fba47146f4b959079d6a79d106030~mv2.png',
 'recognition-2':'408f91_8df7173bd39b40b38e09db388fcacf83~mv2.png',
 'journal-1':'408f91_6865b810e5d845f9b91e6f991b901c93~mv2.png',
 'journal-2':'408f91_e0acd6ae88484936bc7c79ba7db23200~mv2.png',
 'favicon':'408f91_3074ee53c2cd4e8ab1b2340e8f283b10~mv2.png',
}
def fetch(item):
 name,filename=item
 url='https://static.wixstatic.com/media/'+filename
 req=urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'})
 raw=assets/(name+Path(filename).suffix)
 with urllib.request.urlopen(req,timeout=40) as response: raw.write_bytes(response.read())
 original_size=json.loads(subprocess.check_output(['ffprobe','-v','error','-select_streams','v:0','-show_entries','stream=width,height','-of','json',str(raw)]))['streams'][0]
 for suffix,limit,quality in [('',1400,85),('-small',640,80)]:
  subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(raw),'-vf',f'scale={limit}:{limit}:force_original_aspect_ratio=decrease','-frames:v','1','-c:v','libwebp','-quality',str(quality),str(assets/(name+suffix+'.webp'))],check=True)
 print(name,original_size,(assets/(name+'.webp')).stat().st_size)
 return {'name':name,'source':url,'source_page':'https://www.dhisclock.com/','original_dimensions':original_size,'file':name+'.webp'}
with ThreadPoolExecutor(max_workers=5) as pool: records=list(pool.map(fetch,items.items()))
(assets/'sources.json').write_text(json.dumps(records,indent=2),encoding='utf-8')
