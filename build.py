# 把 text.js、data.js、core.js 塞進 index.html，做成單一檔案
import re,os,sys
h=open('index.html',encoding='utf-8').read()
for f in ['text.js','data.js','core.js']:
    js=open(f,encoding='utf-8').read().replace('</script>','<\\/script>')
    pat=re.compile(r'<script src="'+re.escape(f)+r'"></script>')
    assert pat.search(h),f
    h=pat.sub(lambda m:'<script>\n'+js+'\n</script>',h,count=1)
for out in sys.argv[1:]:
    os.makedirs(os.path.dirname(out),exist_ok=True);open(out,'w',encoding='utf-8').write(h)
print(len(h))
