from pathlib import Path
import json
out=Path(__file__).resolve().parents[2]
B='https://www.ncbi.nlm.nih.gov/books/NBK8477/';V='https://www.ncbi.nlm.nih.gov/books/NBK8174/';F='https://pmc.ncbi.nlm.nih.gov/articles/PMC6962315/'
parts={
'parede':('Parede celular','#638eb6','Envoltório que ajuda a manter a forma e a resistir à pressão osmótica.'),
'membrana':('Membrana plasmática','#b9a77c','Delimita a célula e participa do transporte de substâncias.'),
'externa':('Membrana externa','#568f92','Barreira adicional das bactérias Gram-negativas; contém lipopolissacarídeo.'),
'citoplasma':('Citoplasma','#ddbaa3','Compartimento onde ocorrem numerosas reações metabólicas.'),
'nucleoide':('Nucleoide','#d89b52','Região do cromossomo bacteriano, sem membrana nuclear.'),
'ribossomos':('Ribossomos','#eee0c4','Estruturas responsáveis pela síntese de proteínas.'),
'flagelo':('Flagelo','#d4b979','Estrutura associada à motilidade. Distribuição e presença podem variar entre organismos.'),
'pili':('Fímbrias de adesão','#9fc9cb','Apêndices que podem participar da aderência a superfícies; variam entre linhagens.'),
'envelope':('Envelope lipídico','#778db7','Camada lipídica derivada de membranas da célula hospedeira.'),
'espiculas':('Glicoproteínas de superfície','#db806e','Participam do reconhecimento e da entrada na célula hospedeira.'),
'capsideo':('Capsídeo','#b7a3d1','Estrutura proteica que protege o genoma viral.'),
'genoma':('Genoma viral','#e8ba58','Material genético do vírus. Organização representada de forma esquemática.'),
'matriz':('Camada de matriz','#87a7a2','Proteínas que ajudam a organizar a partícula viral junto ao envelope.'),
'nucleocapsideo':('Ribonucleoproteína','#d0af68','RNA associado a proteínas virais; o traçado é ilustrativo, não uma estrutura atômica.'),
'fibras':('Fibras do capsídeo','#9da2db','Projeções nos vértices que participam da ligação a receptores celulares.'),
'nucleo':('Núcleo','#8c76af','Compartimento que contém a maior parte do material genético da célula eucariótica.'),
'vacuolo':('Vacúolo','#6aaba9','Compartimento envolvido em armazenamento, degradação e equilíbrio celular.'),
'mitocondrias':('Mitocôndrias','#d79764','Organelas envolvidas no metabolismo energético.'),
'broto':('Brotamento','#c799b8','Formação de uma célula-filha por brotamento.'),
'capsula':('Cápsula polissacarídica','#99b8ca','Camada externa característica de Cryptococcus; participa da interação com o hospedeiro.'),
'hifas':('Hifas','#caa886','Filamentos que formam o micélio. Espessura e septação são características de estudo.'),
'septos':('Septos','#967d9f','Divisões transversais presentes nas hifas septadas.'),
'conidioforo':('Conidióforo','#aca18a','Estrutura aérea que sustenta a cabeça conidial.'),
'vesicula':('Vesícula terminal','#90a7a1','Dilatação terminal que sustenta as células produtoras de conídios.'),
'fialides':('Fiálides','#809787','Células conidiogênicas que produzem cadeias de conídios.'),
'conidios':('Conídios','#6c9b92','Propágulos assexuados. O arranjo mostrado é uma representação de cultura, não de tecido humano.'),
'esporangio':('Esporângio','#798487','Estrutura que abriga esporangiósporos.'),
'esporos':('Esporangiósporos','#b0a790','Propágulos formados dentro do esporângio.'),
'columela':('Columela','#c1a887','Porção dilatada no interior do esporângio.'),
'rizoides':('Rizoides','#a99579','Filamentos de fixação presentes no gênero Rhizopus.'),
'disco':('Disco adesivo ventral','#7facc3','Estrutura associada à adesão do trofozoíto de Giardia ao epitélio intestinal.'),
'axonemas':('Axonemas','#dfbb77','Estruturas de microtúbulos associadas aos flagelos.'),
'apical':('Complexo apical','#d7ad6d','Conjunto de estruturas associadas à invasão celular nos apicomplexos; representação simplificada.'),
'cinetoplasto':('Cinetoplasto','#d8b969','Região com DNA mitocondrial condensado, característica dos cinetoplastídeos.'),
'ondulante':('Membrana ondulante','#87b5bc','Prega associada ao trajeto do flagelo no corpo do tripomastigota.'),
'vacdigestivo':('Vacúolos digestivos','#c99b72','Compartimentos associados à digestão intracelular.'),
}
rows=[]
def add(id,title,group,shape,summary,focus,ids,sources,cut=True,overrides=None):
 p=[]
 for k in ids.split():
  t,c,f=parts[k]; p.append({'id':k,'title':t,'colorHex':c,'function':f,'appearance':'Selecione para destacar esta estrutura no modelo.'})
 for k,values in (overrides or {}).items():
  for part in p:
   if part['id']==k:part.update(values)
 rows.append(dict(id=id,title=title,group=group,shape=shape,summary=summary,focus=focus,parts=p,sources=sources,cutaway=cut,baseUrl='/wmed/microbiology/'+id,status='Modelo didático original do Blender. Cores, tamanhos relativos e número de estruturas são ilustrativos; não é reconstrução microscópica nem identificação diagnóstica.'))
add('e-coli','Escherichia coli','bacterias','bacillus','Bacilo Gram-negativo. O modelo representa uma variante com fímbrias e flagelos; essas estruturas variam entre linhagens.','Compare a membrana externa com a fina camada de peptidoglicano.','externa parede membrana citoplasma nucleoide ribossomos flagelo pili',[B],overrides={'parede':{'function':'Camada fina de peptidoglicano situada entre as membranas interna e externa.'}})
add('staphylococcus','Staphylococcus aureus','bacterias','cluster','Cocos Gram-positivos que podem formar agrupamentos. O arranjo não permite identificação da espécie isoladamente.','Veja o agrupamento em cachos e a parede espessa.','parede membrana citoplasma nucleoide ribossomos',[B],overrides={'parede':{'function':'Camada espessa de peptidoglicano, característica do envoltório Gram-positivo.'}})
add('streptococcus','Streptococcus pyogenes','bacterias','chain','Cocos Gram-positivos frequentemente organizados em cadeias. A representação enfatiza arranjo e envoltório.','Compare cadeias com os cachos de estafilococos.','parede membrana citoplasma nucleoide ribossomos',[B])
add('vibrio','Vibrio cholerae','bacterias','vibrio','Bacilo Gram-negativo curvo com flagelo polar. A curvatura é apresentada como característica morfológica didática.','Observe o corpo curvo e a origem polar do flagelo.','externa parede membrana citoplasma nucleoide ribossomos flagelo',[B])
add('coronavirus','SARS-CoV-2','virus','corona','Vírus envelopado com RNA de fita simples de sentido positivo. Modelo estrutural simplificado, sem resolução molecular.','Abra o envelope e localize o RNA associado à proteína N.','envelope espiculas nucleocapsideo',['https://www.ncbi.nlm.nih.gov/Structure/SARS-CoV-2.html',V],overrides={'espiculas':{'title':'Proteína S · espícula','function':'Glicoproteína de superfície que participa da ligação e da entrada na célula hospedeira.'}})
add('influenza','Influenza A','virus','influenza','Vírus envelopado cujo genoma possui oito segmentos de RNA. Hemaglutinina e neuraminidase estão representadas na superfície.','Conte os oito segmentos de ribonucleoproteína no corte.','envelope espiculas matriz nucleocapsideo',[V,'https://pubmed.ncbi.nlm.nih.gov/34578369/'],overrides={'espiculas':{'title':'HA e NA · superfície','function':'A hemaglutinina participa da ligação e fusão; a neuraminidase contribui para a liberação de partículas. As projeções representam essas proteínas de forma simplificada, sem escala molecular.'}})
add('hiv','HIV-1','virus','hiv','Retrovírus envelopado com capsídeo cônico e duas cópias de RNA. O desenho destaca sua organização estrutural.','Reconheça o capsídeo cônico dentro do envelope.','envelope espiculas capsideo genoma',[V,'https://pmc.ncbi.nlm.nih.gov/articles/PMC8307803/'],overrides={'genoma':{'function':'Duas cópias de RNA de fita simples. Trajetórias e organização interna são ilustrativas.'}})
add('adenovirus','Adenovírus','virus','adeno','Vírus não envelopado com capsídeo icosaédrico e DNA de dupla fita. Possui fibras projetadas dos vértices.','Compare a ausência de envelope com os outros vírus do acervo.','capsideo fibras genoma',[V],overrides={'genoma':{'function':'DNA de dupla fita contido no capsídeo; a disposição representada não é uma reconstrução molecular.'}})
add('candida','Candida albicans','fungos','candida','Levedura representada em brotamento. A espécie também pode apresentar pseudohifas e hifas, não incluídas nesta vista.','Identifique parede, núcleo, vacúolo e broto.','parede membrana citoplasma nucleo vacuolo mitocondrias broto',[F])
add('cryptococcus','Cryptococcus neoformans','fungos','crypto','Levedura encapsulada. O modelo destaca a cápsula polissacarídica e o brotamento de base estreita.','Compare a cápsula externa com a parede celular.','capsula parede membrana citoplasma nucleo vacuolo broto',[F])
add('aspergillus','Aspergillus · cabeça conidial','fungos','aspergillus','Representação genérica de estrutura reprodutiva em cultura, com vesícula, fiálides e conídios. A organização varia por espécie.','Siga a sequência conidióforo → vesícula → fiálides → conídios.','hifas septos conidioforo vesicula fialides conidios',[F,'https://www.cdc.gov/aspergillosis/hcp/clinical-overview/'],False)
add('rhizopus','Rhizopus · esporângio','fungos','rhizopus','Representação de estrutura de cultura: hifa, rizoides e esporângio. Não corresponde à apresentação em tecido humano.','Abra o esporângio para localizar os esporos e a columela.','hifas rizoides conidioforo esporangio columela esporos',['https://wwwn.cdc.gov/phil/Details.aspx?pid=26741','https://wwwnc.cdc.gov/eid/article/29/7/22-1491-t1'],overrides={'conidioforo':{'title':'Esporangióforo','function':'Haste que sustenta o esporângio; não produz conídios externos.'}})
add('giardia','Giardia duodenalis · trofozoíto','protozoarios','giardia','Forma flagelada com simetria bilateral, dois núcleos e disco adesivo ventral. Não representa o cisto.','Localize os dois núcleos e os quatro pares de flagelos.','membrana citoplasma nucleo disco axonemas flagelo',['https://www.cdc.gov/dpdx/giardiasis/'])
add('toxoplasma','Toxoplasma gondii · taquizoíto','protozoarios','toxo','Forma alongada e arqueada com uma extremidade apical afilada. As organelas apicais são simplificadas no modelo.','Localize o polo apical e o núcleo no corpo arqueado.','membrana citoplasma nucleo apical',['https://www.cdc.gov/dpdx/toxoplasmosis/index.html'])
add('trypanosoma','Trypanosoma cruzi · tripomastigota','protozoarios','tryp','Forma alongada com núcleo, cinetoplasto, membrana ondulante e flagelo. Não representa o amastigota intracelular.','Diferencie núcleo de cinetoplasto.','membrana citoplasma nucleo cinetoplasto ondulante flagelo',['https://www.cdc.gov/dpdx/trypanosomiasisamerican/'])
add('entamoeba','Entamoeba histolytica · trofozoíto','protozoarios','amoeba','Forma ameboide com pseudópodes, núcleo e vacúolos. A morfologia isolada não diferencia todas as espécies semelhantes.','Observe o contorno irregular e as estruturas internas.','membrana citoplasma nucleo vacdigestivo',['https://www.cdc.gov/dpdx/amebiasis/'])
(out/'public/microbiology/catalog.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2))
