(function(){
"use strict";
var LOGO = "logo.jpg";
var CFG = window.APP_CONFIG || {};
var TODAY = "2026-10-21";   // data dos dados de exemplo; ao entrar de verdade vira a data de hoje

/* ---------- utilidades ---------- */
function pad(n){return String(n).padStart(2,"0")}
function d2s(d){return d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate())}
function s2d(s){var p=s.split("-").map(Number);return new Date(p[0],p[1]-1,p[2])}
function addDays(s,n){var d=s2d(s);d.setDate(d.getDate()+n);return d2s(d)}
var DOW=["dom","seg","ter","qua","qui","sex","sáb"];
var MES=["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"];
var MES3=["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"];
function fmtD(s){var d=s2d(s);return DOW[d.getDay()]+", "+pad(d.getDate())+"/"+pad(d.getMonth()+1)}
function fmtLong(s){var d=s2d(s);return DOW[d.getDay()]+", "+d.getDate()+" de "+MES[d.getMonth()]+" de "+d.getFullYear()}
function hhmm(){var d=new Date();return pad(d.getHours())+":"+pad(d.getMinutes())}
function quando(dt,h){if(dt===TODAY)return "Hoje "+h; if(dt===addDays(TODAY,-1))return "Ontem "+h; var d=s2d(dt);return pad(d.getDate())+"/"+pad(d.getMonth()+1)+" "+h}
function brl(n){return "R$ "+Number(n).toFixed(2).replace(".",",").replace(/\B(?=(\d{3})+(?!\d))/g,".")}
function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function ini(n){var p=String(n).trim().split(/\s+/);return ((p[0]||"")[0]||"").toUpperCase()+((p.length>1?p[p.length-1][0]:"")||"").toUpperCase()}
function uid(){return Date.now()+Math.floor(Math.random()*1000)}
function codigo(){var a="ABCDEFGHJKMNPQRSTUVWXYZ23456789",s="";for(var i=0;i<4;i++)s+=a[Math.floor(Math.random()*a.length)];return s}
function maskMail(e){var i=e.indexOf("@");return i>2?e.slice(0,2)+"***"+e.slice(i):e}

var IC={
 home:'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
 cal:'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
 calplus:'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18M12 14v4M10 16h4"/>',
 box:'<path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="m3 8 9 5 9-5"/><path d="M12 13v8"/>',
 user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
 users:'<circle cx="9" cy="8" r="4"/><path d="M2 21a7 7 0 0 1 14 0"/><path d="M16 4a4 4 0 0 1 0 8M22 21a7 7 0 0 0-4-6.3"/>',
 bell:'<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
 back:'<path d="m15 18-6-6 6-6"/>',
 next:'<path d="m9 18 6-6-6-6"/>',
 x:'<path d="M18 6 6 18M6 6l12 12"/>',
 check:'<path d="M20 6 9 17l-5-5"/>',
 info:'<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
 cam:'<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z"/><circle cx="12" cy="13" r="3"/>',
 grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
 more:'<circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/>',
 out:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
 list:'<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
 shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
 lock:'<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
 gear:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
 chart:'<path d="M3 3v18h18"/><path d="M7 16v-5M12 16V8M17 16v-8"/>',
 ban:'<circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/>',
 pin:'<path d="M3 7h18v13H3z"/><path d="M3 7l2-4h14l2 4M9 11h6"/>',
 wa:'<path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l2.1-5.4A8.4 8.4 0 1 1 21 11.5z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 .8c-1-.4-1.9-1.3-2.3-2.3l.8-1-1-2z"/>',
 send:'<path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/>',
 key:'<circle cx="7.5" cy="15.5" r="4.5"/><path d="m10.7 12.3 9.8-9.8M17 6l3 3M14 9l2 2"/>',
 file:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>',
 clip:'<path d="m21.4 11-9.2 9.2a6 6 0 0 1-8.5-8.5l9.2-9.2a4 4 0 0 1 5.7 5.7l-9.2 9.2a2 2 0 0 1-2.8-2.8l8.5-8.5"/>',
 car:'<path d="M3 13l2-6a2 2 0 0 1 1.9-1.4h10.2A2 2 0 0 1 19 7l2 6v5h-3v-2H6v2H3z"/><path d="M3 13h18"/><circle cx="7.5" cy="15.5" r=".5"/><circle cx="16.5" cy="15.5" r=".5"/>',
 swap:'<path d="M16 3l4 4-4 4M20 7H4M8 21l-4-4 4-4M4 17h16"/>',
 phone:'<rect x="6" y="2" width="12" height="20" rx="2"/><path d="M11 18h2"/>'
};
function ic(n,s){s=s||22;return '<svg width="'+s+'" height="'+s+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+IC[n]+'</svg>'}

function fakeDoc(tipo,nome,extra){
 var veic=tipo==="CRLV";
 var svg='<svg xmlns="http://www.w3.org/2000/svg" width="480" height="300" viewBox="0 0 480 300"><rect width="480" height="300" rx="18" fill="'+(veic?"#E7F0E2":"#E4ECF5")+'"/><rect x="0" y="0" width="480" height="46" rx="18" fill="'+(veic?"#4F7A43":"#2F5B85")+'"/><rect x="0" y="28" width="480" height="18" fill="'+(veic?"#4F7A43":"#2F5B85")+'"/><text x="24" y="31" font-family="Arial" font-size="17" font-weight="700" fill="#fff">'+(veic?"CERTIFICADO DE REGISTRO E LICENCIAMENTO":tipo==="CNH"?"CARTEIRA NACIONAL DE HABILITAÇÃO":"REGISTRO GERAL")+'</text>'+(veic?'<rect x="24" y="70" width="130" height="90" rx="10" fill="#C7D6C0"/><path d="M40 135l12-30h50l12 30z" fill="#8FA886"/><circle cx="58" cy="140" r="8" fill="#5D7656"/><circle cx="100" cy="140" r="8" fill="#5D7656"/>':'<rect x="24" y="66" width="110" height="140" rx="10" fill="#C5D1DE"/><circle cx="79" cy="115" r="26" fill="#93A4B6"/><rect x="45" y="148" width="68" height="42" rx="18" fill="#93A4B6"/>')+'<text x="170" y="92" font-family="Arial" font-size="20" font-weight="700" fill="#22303C">'+nome.replace(/&/g,"e")+'</text><text x="170" y="128" font-family="Arial" font-size="17" fill="#3E4D5A">'+extra+'</text><rect x="170" y="150" width="240" height="10" rx="5" fill="#C9D3DD"/><rect x="170" y="172" width="180" height="10" rx="5" fill="#C9D3DD"/><text x="24" y="276" font-family="Arial" font-size="14" font-weight="700" fill="#8B97A3">DOCUMENTO FICTÍCIO · PROTÓTIPO</text></svg>';
 return {nome:(tipo+"-"+nome.split(" ")[0]).toLowerCase()+".jpg",tipo:"img",url:"data:image/svg+xml;charset=utf-8,"+encodeURIComponent(svg)};
}
/* ---------- dados de exemplo ---------- */
function seed(){
 return {
  role:null, screen:null, login:{step:"email",email:"",codigo:"",err:""},
  me:{morador:1, sindico:23}, porteiro:null, portLast:0,
  cfg:{nome:"Ed. Marapendi",andares:18,porLado:6,porAndar:12,cota:100,lembrete:3,codigoMin:10,codigoTent:5,sesMorador:30,sesPortaria:90,sesAdm:7,fotoDias:90,bkpDias:30,cadDia:30,cadPessoas:5,exigirPin:false,locSoProp:false,inclSoTitular:false,emailReserva:30,portariaEmail:"portaria.edmarapendi@gmail.com",portRelogin:15,locAntMin:2,locDocsDias:30,waAtivo:true,waNumero:"(21) 98888-0000",waModelo:"Olá, {nome}! Aqui é a portaria do Ed. Marapendi.\nChegou para o apto {apto}: {tipo}{remetente}, às {hora}.\nPode retirar na portaria. Código de conferência: {codigo}."},
  areas:[
   {id:"churras",nome:"Churrasqueira",cap:20,preco:80,manual:false,modo:"integral",abre:"10:00",fecha:"23:00",turnos:[{id:"t1",nome:"Almoço",ini:"11:00",fim:"16:00"},{id:"t2",nome:"Noite",ini:"18:00",fim:"23:00"}],antMin:2,antMax:90,canc:48,termos:"Respeitar o silêncio após as 22h. Devolver o espaço limpo. Danos são cobrados da unidade.",ativo:true},
   {id:"salao",nome:"Salão de festas",cap:60,preco:150,manual:false,modo:"integral",abre:"10:00",fecha:"23:00",turnos:[],antMin:2,antMax:90,canc:48,termos:"Respeitar o silêncio após as 22h. Som com volume moderado. Devolver o espaço limpo. Danos são cobrados da unidade.",ativo:true}
  ],
  usuarios:[
   {id:1,apto:"1203",nome:"Maria Souza",email:"maria.souza@gmail.com",tel:"(21) 99876-5432",wa:true,perfil:"morador",vinculo:"Proprietária",sit:"Ativo"},
   {id:2,apto:"1203",nome:"Pedro Souza",email:"pedro.souza@hotmail.com",tel:"(21) 99111-2233",wa:false,avEmail:false,perfil:"morador",vinculo:"Proprietário",sit:"Ativo"},
   {id:13,apto:"1203",nome:"Ana Souza",email:"ana.souza@gmail.com",tel:"",perfil:"morador",vinculo:"Familiar",sit:"Ativo"},
   {id:3,apto:"504",nome:"Carla Mendes",email:"carla.m@gmail.com",tel:"(21) 98123-4567",wa:true,perfil:"morador",vinculo:"Inquilina",sit:"Ativo"},
   {id:4,apto:"807",nome:"Jorge Tavares",email:"jorge.t@gmail.com",tel:"(21) 99654-3210",wa:false,perfil:"morador",vinculo:"Proprietário",sit:"Ativo"},
   {id:5,apto:"1811",nome:"Rafael Lima",email:"rafa.lima@yahoo",tel:"",perfil:"morador",vinculo:"Proprietário",sit:"E-mail inválido"},
   {id:6,apto:"1811",nome:"Júlia Lima",email:"julia.lima@gmail.com",tel:"",perfil:"morador",vinculo:"Familiar",sit:"Ativo"},
   {id:7,apto:"305",nome:"Paulo Reis",email:"paulo.reis@gmail.com",tel:"",perfil:"morador",vinculo:"Proprietário",sit:"Ativo"},
   {id:8,apto:"1507",nome:"Luana Costa",email:"luana.c@gmail.com",tel:"(21) 97777-1212",wa:true,perfil:"morador",vinculo:"Inquilina",sit:"Ativo"},
   {id:9,apto:"909",nome:"Diego Alves",email:"diego.alves@gmail.com",tel:"",perfil:"morador",vinculo:"Proprietário",sit:"Ativo"},
   {id:10,apto:"1112",nome:"Bruno Melo",email:"bruno.melo@gmail.com",tel:"",perfil:"morador",vinculo:"Proprietário",sit:"Ativo"},
   {id:11,apto:"1212",nome:"Helena Prado",email:"helena.p@gmail.com",tel:"",perfil:"morador",vinculo:"Proprietária",sit:"Convite pendente"},
   {id:14,apto:"COB",nome:"Fernando Castro",email:"fernando.castro@gmail.com",tel:"",perfil:"morador",vinculo:"Proprietário",sit:"Ativo"},
   {id:12,apto:"210",nome:"Sônia Prado",email:"sonia.prado@gmail.com",tel:"",perfil:"morador",vinculo:"Proprietária",sit:"Ativo"},
   {id:20,apto:"",nome:"João Batista",email:"",tel:"",pin:"1234",perfil:"porteiro",turno:"Tarde (14h–22h)",sit:"Ativo"},
   {id:21,apto:"",nome:"Carlos Nunes",email:"",tel:"",pin:"2580",perfil:"porteiro",turno:"Manhã (06h–14h)",sit:"Ativo"},
   {id:22,apto:"",nome:"Marcos Dias",email:"",tel:"",perfil:"porteiro",turno:"Noite (22h–06h)",sit:"Ativo"},
   {id:25,apto:"",nome:"Severino Costa",email:"",tel:"",perfil:"porteiro",turno:"Folguista",sit:"Ativo"},
   {id:26,apto:"",nome:"Wagner Lima",email:"",tel:"",perfil:"porteiro",turno:"Manhã (06h–14h)",sit:"Desativado"},
   {id:23,apto:"",nome:"Roberto Almeida",email:"roberto.sindico@gmail.com",tel:"",perfil:"sindico",mandato:"2027-12-31",sit:"Ativo"},
   {id:24,apto:"",nome:"Ana Ribeiro",email:"ana.adm@gmail.com",tel:"",perfil:"administracao",sit:"Ativo"}
  ],
  reservas:[
   {id:1,por:"Jorge Tavares",area:"churras",data:TODAY,turno:"integral",apto:"807",nome:"Jorge Tavares",status:"confirmada",isenta:false,convidados:[{n:"Fernanda Tavares",d:""},{n:"Ricardo Nogueira",d:"***.482.***-10"},{n:"Paula Nogueira",d:""},{n:"Gustavo Lins",d:""},{n:"Marina Lins",d:""},{n:"Tiago Rocha",d:""}]},
   {id:2,por:"Maria Souza",area:"salao",data:"2026-10-31",turno:"integral",apto:"1203",nome:"Maria Souza",status:"confirmada",isenta:false,convidados:[{n:"Cláudia Souza",d:""},{n:"Henrique Souza",d:""},{n:"Beatriz Rocha",d:""},{n:"Lucas Rocha",d:""}]},
   {id:3,por:"Paulo Reis",area:"churras",data:"2026-11-07",turno:"integral",apto:"305",nome:"Paulo Reis",status:"confirmada",isenta:false,convidados:[]},
   {id:4,por:"Luana Costa",area:"salao",data:"2026-11-08",turno:"integral",apto:"1507",nome:"Luana Costa",status:"confirmada",isenta:false,convidados:[]},
   {id:5,por:"Pedro Souza",area:"churras",data:"2026-11-14",turno:"integral",apto:"1203",nome:"Pedro Souza",status:"aguardando",isenta:false,convidados:[]},
   {id:6,por:"Diego Alves",area:"salao",data:"2026-11-15",turno:"integral",apto:"909",nome:"Diego Alves",status:"confirmada",isenta:false,convidados:[]},
   {id:7,por:"Sônia Prado",area:"salao",data:"2026-11-22",turno:"integral",apto:"210",nome:"Sônia Prado",status:"cancelada",isenta:false,convidados:[]},
   {id:8,por:"Bruno Melo",area:"churras",data:"2026-11-28",turno:"integral",apto:"1112",nome:"Bruno Melo",status:"confirmada",isenta:false,convidados:[],criado:"2026-10-20 14:32:05"},
   {id:10,por:"Carla Mendes",area:"churras",data:"2026-11-28",turno:"integral",apto:"504",nome:"Carla Mendes",status:"confirmada",isenta:false,convidados:[],criado:"2026-10-20 14:32:07"},
   {id:9,por:"Ana Souza",area:"churras",data:"2026-12-05",turno:"integral",apto:"1203",nome:"Ana Souza",status:"confirmada",isenta:false,convidados:[{n:"Júlia Martins",d:""},{n:"Caio Martins",d:""}]}
  ],
  solicitacoes:[
   {id:501,pedido:50,origem:"publico",solicitante:"",apto:"1212",criado:"14/10 20:11",nome:"Helena Prado",email:"helena.p@gmail.com",tel:"",vinc:"Proprietário(a)",wa:false,status:"aprovada",decididoPor:"Ana Ribeiro",decididoEm:"15/10 09:02"},
   {id:511,pedido:51,origem:"publico",solicitante:"",apto:"704",criado:"20/10 19:40",nome:"Marcos Vieira",email:"marcos.vieira@gmail.com",tel:"(21) 99222-3344",vinc:"Proprietário(a)",wa:true,status:"pendente"},
   {id:512,pedido:51,origem:"publico",solicitante:"",apto:"704",criado:"20/10 19:40",nome:"Lúcia Vieira",email:"lucia.vieira@gmail.com",tel:"",vinc:"Dependente maior de idade",wa:false,status:"pendente"},
   {id:521,pedido:52,origem:"morador",solicitante:"Maria Souza",apto:"1203",criado:"21/10 08:15",nome:"Clara Souza",email:"clara.souza@gmail.com",tel:"",vinc:"Familiar",wa:false,status:"pendente"},
   {id:531,pedido:53,origem:"publico",solicitante:"",apto:"1203",criado:"21/10 10:02",nome:"Roberta Lima",email:"roberta.lima@outlook.com",tel:"(21) 98111-0000",vinc:"Proprietário(a)",wa:false,status:"pendente"}
  ],
  cadHoje:0,
  extras:[
   {num:"COB",nome:"Cobertura",tipo:"residencial",local:"19º andar",encomendas:true,reservas:true,ativo:true},
   {num:"ADM",nome:"Administração",tipo:"condominio",local:"Térreo",encomendas:true,reservas:false,ativo:true}
  ],
  locacoes:[
   {id:1,apto:"1507",por:"Luana Costa",criado:"20/10 21:14",de:"2026-10-30",ate:"2026-11-03",status:"pendente",plataforma:"Airbnb",contato:"Luana Costa · (21) 97777-1212",obs:"Hóspedes chegam por volta das 15h.",semCarro:false,
    pessoas:[{nome:"Ricardo Almeida Prado",rg:"21.345.678-9",cpf:"529.982.247-25",doc:fakeDoc("RG","Ricardo Almeida Prado","RG 21.345.678-9")},{nome:"Fernanda Lopes Prado",rg:"18.765.432-1",cpf:"111.444.777-35",doc:fakeDoc("CNH","Fernanda Lopes Prado","CPF 111.444.777-35")}],
    veiculos:[{placa:"RIO2A18",modelo:"Onix prata",doc:fakeDoc("CRLV","Chevrolet Onix · prata","Placa RIO2A18")}],
    hist:[{q:"20/10 21:14",t:"Solicitação enviada por Luana Costa"}]},
   {id:2,apto:"1203",por:"Maria Souza",criado:"15/10 10:02",de:"2026-10-20",ate:"2026-10-25",status:"aprovada",plataforma:"Direto com o proprietário",contato:"Maria Souza · (21) 99876-5432",obs:"",semCarro:true,
    pessoas:[{nome:"Gabriel Nogueira",rg:"12.111.222-3",cpf:"390.533.447-05",doc:fakeDoc("RG","Gabriel Nogueira","RG 12.111.222-3")}],veiculos:[],
    hist:[{q:"15/10 10:02",t:"Solicitação enviada por Maria Souza"},{q:"16/10 09:40",t:"Aprovada por Ana Ribeiro (administração)"}],decisao:{por:"Ana Ribeiro",q:"16/10 09:40"}},
   {id:3,apto:"909",por:"Diego Alves",criado:"18/10 19:30",de:"2026-11-20",ate:"2026-11-27",status:"recusada",plataforma:"Booking",contato:"Diego Alves",obs:"",semCarro:false,motivo:"A foto do documento do carro (CRLV) está ilegível. Envie uma foto mais nítida e faça uma nova solicitação.",
    pessoas:[{nome:"Marcelo Tavares Rocha",rg:"30.222.111-0",cpf:"529.982.247-25",doc:fakeDoc("RG","Marcelo Tavares Rocha","RG 30.222.111-0")}],
    veiculos:[{placa:"KXP4C21",modelo:"HB20 branco",doc:fakeDoc("CRLV","Hyundai HB20 · branco","Placa KXP4C21")}],
    hist:[{q:"18/10 19:30",t:"Solicitação enviada por Diego Alves"},{q:"19/10 11:12",t:"Recusada por Roberto Almeida (síndico)"}],decisao:{por:"Roberto Almeida",q:"19/10 11:12"}}
  ],
  bloqueios:[{id:1,area:"todas",de:"2026-11-10",ate:"2026-11-11",motivo:"Manutenção da rede de gás",autor:"Ana Ribeiro"}],
  encomendas:[
   {id:1,apto:"1203",tipo:"Envelope",rem:"Correios",data:TODAY,hora:"08:42",porteiro:"Carlos Nunes",cod:"3M9X",status:"pendente",aviso:"email",foto:null},
   {id:2,apto:"1203",tipo:"Caixa média",rem:"Mercado Livre",data:"2026-10-20",hora:"18:15",porteiro:"João Batista",cod:"7K4P",status:"pendente",aviso:"email",foto:null},
   {id:3,apto:"504",tipo:"Caixa grande",rem:"Amazon",data:"2026-10-20",hora:"16:10",porteiro:"João Batista",cod:"8Q2T",status:"pendente",aviso:"cota",foto:null},
   {id:4,apto:"1811",tipo:"Caixa pequena",rem:"Shopee",data:"2026-10-18",hora:"11:05",porteiro:"Carlos Nunes",cod:"5H6N",status:"pendente",aviso:"invalido",foto:null},
   {id:5,apto:"909",tipo:"Envelope",rem:"Banco",data:"2026-10-20",hora:"10:20",porteiro:"Carlos Nunes",cod:"2RWE",status:"pendente",aviso:"email",foto:null},
   {id:6,apto:"1203",tipo:"Caixa pequena",rem:"Amazon",data:"2026-10-17",hora:"10:02",porteiro:"Carlos Nunes",cod:"9TXB",status:"retirada",aviso:"email",foto:null,por:"Maria Souza",em:"17/10 19:20",entregue:"João Batista"},
   {id:7,apto:"1203",tipo:"Delivery",rem:"iFood",data:"2026-10-15",hora:"20:01",porteiro:"Marcos Dias",cod:"K3ZA",status:"retirada",aviso:"email",foto:null,por:"Pedro Souza",em:"15/10 20:05",entregue:"Marcos Dias"},
   {id:8,apto:"305",tipo:"Delivery",rem:"iFood",data:TODAY,hora:"07:55",porteiro:"Carlos Nunes",cod:"P8LM",status:"retirada",aviso:"email",foto:null,por:"Paulo Reis",em:"Hoje 08:01",entregue:"Carlos Nunes"}
  ],
  notifs:[
   {id:1,apto:"1203",txt:"Envelope (Correios) chegou na portaria.",q:"Hoje 08:42",lida:false,ir:"encomendas"},
   {id:2,apto:"1203",txt:"Caixa média (Mercado Livre) chegou na portaria.",q:"Ontem 18:15",lida:false,ir:"encomendas"},
   {id:3,apto:"1203",txt:"Sua reserva do Salão de festas em 31/10 está confirmada.",q:"12/10 10:30",lida:true,ir:"reservas"},
   {id:4,apto:"1203",txt:"Locação de 20/10 a 25/10 aprovada pela administração.",q:"16/10 09:40",lida:true,ir:"loc"},
   {id:5,apto:"909",txt:"Sua solicitação de locação de 20/11 a 27/11 foi recusada. Veja o motivo.",q:"19/10 11:12",lida:false,ir:"loc"}
  ],
  audit:[
   {q:"21/10 08:42",quem:"Carlos Nunes (portaria)",acao:"Registrou encomenda",det:"Apto 1203 · Envelope · Correios"},
   {q:"21/10 08:01",quem:"Carlos Nunes (portaria)",acao:"Registrou retirada",det:"Apto 305 · Delivery · retirado por Paulo Reis"},
   {q:"20/10 18:15",quem:"João Batista (portaria)",acao:"Registrou encomenda",det:"Apto 1203 · Caixa média · Mercado Livre"},
   {q:"20/10 16:12",quem:"Sistema",acao:"E-mail não enviado",det:"Apto 504 · cota diária atingida · aviso mantido no app"},
   {q:"20/10 12:03",quem:"Maria Souza (1203)",acao:"Solicitou reserva",det:"Churrasqueira · 14/11 · período integral"},
   {q:"18/10 11:06",quem:"Sistema",acao:"E-mail não enviado",det:"Apto 1811 · endereço inválido · aviso mantido no app"},
   {q:"18/10 10:30",quem:"Ana Ribeiro (administração)",acao:"Criou bloqueio",det:"Todos os espaços · 10/11 a 11/11 · manutenção da rede de gás"}
  ],
  ui:{}, f:{}, sheet:null, toast:""
 };
}
var S=seed();
S.conexao={st:"testando"};S.real=null;S.srvMor={};S.meusPedidos=[];

/* ---------- regras ---------- */
function area(id){return S.areas.filter(function(a){return a.id===id})[0]}
function user(id){return S.usuarios.filter(function(u){return String(u.id)===String(id)})[0]}
function me(){if(S.role==="portaria")return S.porteiro?user(S.porteiro):{nome:"Portaria",apto:"",perfil:"porteiro"};return user(S.me[S.role])}
function porteirosAtivos(){return S.usuarios.filter(function(u){return u.perfil==="porteiro"&&u.sit==="Ativo"})}
function loc(id){return S.locacoes.filter(function(l){return l.id===id})[0]}
function locSt(l){if(l.status==="aprovada"){if(l.ate<TODAY)return "encerrada";if(l.de<=TODAY)return "andamento"}return l.status}
function locPill(l){var m={pendente:["Aguardando análise","p-warn"],aprovada:["Aprovada","p-ok"],andamento:["Hospedagem em andamento","p-sea"],encerrada:["Encerrada","p-off"],recusada:["Recusada","p-bad"],cancelada:["Cancelada","p-off"]}[locSt(l)];return '<span class="pill '+m[1]+'">'+m[0]+'</span>'}
function noites(de,ate){return Math.round((s2d(ate)-s2d(de))/86400000)}
function periodo(l){return pad(s2d(l.de).getDate())+"/"+pad(s2d(l.de).getMonth()+1)+" a "+pad(s2d(l.ate).getDate())+"/"+pad(s2d(l.ate).getMonth()+1)+" · "+noites(l.de,l.ate)+(noites(l.de,l.ate)===1?" noite":" noites")}
function cpfOk(c){c=soDig(c);if(c.length!==11||/^(\d)\1+$/.test(c))return false;for(var t=9;t<11;t++){var sm=0;for(var i=0;i<t;i++)sm+=+c[i]*(t+1-i);var dg=(sm*10)%11%10;if(dg!==+c[t])return false}return true}
function fmtCpf(c){c=soDig(c);return c.length===11?c.slice(0,3)+"."+c.slice(3,6)+"."+c.slice(6,9)+"-"+c.slice(9):c}
function maskCpf(c){c=soDig(c);return c.length===11?"***."+c.slice(3,6)+"."+c.slice(6,9)+"-**":"***"}
function maskRg(r){var d=String(r);var n=soDig(d).length;var k=0;return d.replace(/\d/g,function(x){k++;return k<=n-3?"•":x})}
function quandoAgora(){var d=new Date();return pad(d.getDate())+"/"+pad(d.getMonth()+1)+" "+hhmm()}
function quemAudit(){var u=me();return u.nome+(S.role==="morador"?" ("+u.apto+")":S.role==="portaria"?" (portaria)":" ("+(u.perfil==="sindico"?"síndico":"administração")+")")}
function audit(acao,det){var d=new Date();S.audit.unshift({q:pad(d.getDate())+"/"+pad(d.getMonth()+1)+" "+hhmm(),quem:quemAudit(),acao:acao,det:det})}
function notify(apto,txt,ir){S.notifs.unshift({id:uid(),apto:apto,txt:txt,q:"Agora "+hhmm(),lida:false,ir:ir})}
function unExtra(a){var x=String(a||"").trim().toUpperCase();return S.extras.filter(function(e){return e.num.toUpperCase()===x})[0]}
function aptoPadrao(a){var n=parseInt(a,10);if(isNaN(n)||String(n)!==String(a).trim())return false;var f=Math.floor(n/100),k=n%100;return f>=1&&f<=S.cfg.andares&&k>=1&&k<=S.cfg.porLado*2}
function aptoValido(a){if(aptoPadrao(a))return true;var e=unExtra(a);return !!(e&&e.ativo)}
function aptoNorm(a){var e=unExtra(a);return e?e.num:String(parseInt(a,10))}
function ladoDe(a){var k=parseInt(a,10)%100;return k<=S.cfg.porLado?"A":"B"}
function unLabel(a){var e=unExtra(a);return e?e.nome+" ("+e.num+")":"apto "+a+" · Lado "+ladoDe(a)}
function faixaLado(l){return l==="A"?"01 a "+pad(S.cfg.porLado):pad(S.cfg.porLado+1)+" a "+pad(S.cfg.porLado*2)}
function moradoresDe(apto){return S.usuarios.filter(function(u){return u.perfil==="morador"&&u.apto===String(apto)&&u.sit!=="Desativado"&&u.sit!=="Excluído"})}
function podeLoc(u){return !S.cfg.locSoProp||/^Propriet/.test(u.vinculo||"")}
function podeIncl(u){return !S.cfg.inclSoTitular||/^(Propriet|Inquilin)/.test(u.vinculo||"")}
function loteDe(e){return e.lote?S.encomendas.filter(function(x){return x.lote===e.lote&&x.status==="pendente"}):[e]}
function waDest(apto){return moradoresDe(apto).filter(function(u){return u.wa&&u.tel})}
function waTexto(e,dest){var m=S.cfg.waModelo,L=loteDe(e),tp,rm,cd;if(L.length>1){tp=L.length+" encomendas ("+L.map(function(x){return x.tipo.toLowerCase()+(x.rem?" "+x.rem:"")}).join(", ")+")";rm="";cd=L.map(function(x){return x.cod}).join(", ")}else{tp=e.tipo.toLowerCase();rm=e.rem?" ("+e.rem+")":"";cd=e.cod}
 return m.replace(/\{nome\}/g,dest?dest.nome.split(" ")[0]:"morador(a)").replace(/\{apto\}/g,e.apto).replace(/\{tipo\}/g,tp).replace(/\{remetente\}/g,rm).replace(/\{hora\}/g,e.hora).replace(/\{codigo\}/g,cd)}
function fmtCriado(c){return c?c.slice(8,10)+"/"+c.slice(5,7)+" às "+c.slice(11):"—"}
function duplicidades(){var out=[],vis={};S.reservas.filter(ativa).forEach(function(r){S.reservas.forEach(function(o){if(o.id!==r.id&&ativa(o)&&o.area===r.area&&o.data===r.data&&(r.turno==="integral"||o.turno==="integral"||r.turno===o.turno)){var k=[String(r.id),String(o.id)].sort().join("-");if(!vis[k]){vis[k]=1;out.push([r,o].sort(function(a,b){return (a.criado||"")<(b.criado||"")?-1:1}))}}})});return out}
function soDig(t){return String(t||"").replace(/\D/g,"")}
function ativa(r){return r.status==="confirmada"||r.status==="aguardando"}
function bloqueio(areaId,data){return S.bloqueios.filter(function(b){return (b.area==="todas"||b.area===areaId)&&data>=b.de&&data<=b.ate})[0]}
function turnoLabel(a,t){if(t==="integral")return "Período integral · "+a.abre.replace(":00","h")+"–"+a.fecha.replace(":00","h");var x=a.turnos.filter(function(z){return z.id===t})[0];return x?x.nome+" · "+x.ini.replace(":00","h")+"–"+x.fim.replace(":00","h"):"—"}
function conflito(areaId,data,turno,ignore){
 var b=bloqueio(areaId,data); if(b)return {tipo:"bloq",msg:"Data bloqueada pela administração: "+b.motivo+"."};
 var r=S.reservas.filter(function(r){return r.id!==ignore&&r.area===areaId&&r.data===data&&ativa(r)&&(turno==="integral"||r.turno==="integral"||r.turno===turno)})[0];
 if(r)return {tipo:"ocup",msg:area(areaId).nome+" já reservada nesta data"+(r.apto?" (apto "+r.apto+")":"")+"."};
 return null;
}
function diaStatus(a,data,turnoSel,adm){
 var min=adm?TODAY:addDays(TODAY,a.antMin), max=adm?addDays(TODAY,450):addDays(TODAY,a.antMax);
 if(data<min||data>max)return "ind";
 if(bloqueio(a.id,data))return "bloq";
 if(a.modo==="integral")return conflito(a.id,data,"integral")?"ocup":"livre";
 var livres=a.turnos.filter(function(t){return !conflito(a.id,data,t.id)});
 return livres.length?"livre":"ocup";
}
function statusPill(st){var m={confirmada:["Confirmada","p-ok"],aguardando:["Aguardando aprovação","p-warn"],cancelada:["Cancelada","p-off"],recusada:["Recusada","p-bad"]}[st];return '<span class="pill '+m[1]+'">'+m[0]+'</span>'}
function avisoPill(e){var m={email:["E-mail enviado","p-ok"],cota:["Só no app · cota de e-mail","p-warn"],invalido:["Só no app · e-mail inválido","p-bad"]}[e.aviso]||["Aviso no app","p-sea"];return '<span class="pill '+m[1]+'">'+m[0]+'</span>'}
function resPorId(id){return S.reservas.filter(function(x){return String(x.id)===String(id)})[0]}
function inicioRes(r){var a=area(r.area),h=r.turno==="integral"?a.abre:((a.turnos.filter(function(t){return String(t.id)===String(r.turno)})[0]||{}).ini||"00:00");var p=r.data.split("-"),q=String(h||"00:00").split(":");return new Date(+p[0],+p[1]-1,+p[2],+q[0]||0,+q[1]||0)}
function podeCancelar(r){var a=area(r.area);var lim=new Date(inicioRes(r).getTime()-a.canc*3600000);return (S.real?new Date():new Date(2026,9,21,9,0))<lim}
var REGRAS_PADRAO="Ao reservar, você se compromete a respeitar as regras do condomínio.";
function termoUrl(a){var c=(S.termos||{})[a.id];return c&&c.v===a.termoVersao&&c.url?c.url:""}
function carregarTermo(a,abrir){S.termos=S.termos||{};var c=S.termos[a.id];if(c&&c.v===a.termoVersao&&(c.carregando||c.url)){if(abrir&&c.url)S.sheet={t:"termoPdf",id:a.id};return}
 S.termos[a.id]={v:a.termoVersao,carregando:true};
 chamarServidor("areas.termo",{id:a.id},{silencioso:true}).then(function(d){var b=atob(d.pdf.split(",")[1]),u=new Uint8Array(b.length);for(var i=0;i<b.length;i++)u[i]=b.charCodeAt(i);
  S.termos[a.id]={v:a.termoVersao,url:URL.createObjectURL(new Blob([u],{type:"application/pdf"}))};if(abrir)S.sheet={t:"termoPdf",id:a.id};render()},
  function(e){delete S.termos[a.id];if(abrir)toast(e.mensagem);render()})}
function areaPadrao(){var l=S.areas.filter(function(x){return x.ativo});return l.length?l[0].id:(S.areas[0]||{}).id}
function mesAtual(){return {y:+TODAY.slice(0,4),m:+TODAY.slice(5,7)-1}}

/* ---------- componentes ---------- */
function logo(sz){return '<div class="logo" style="width:'+sz+'px;height:'+sz+'px"><img src="'+LOGO+'" alt="Logo Ed. Marapendi"></div>'}
function topbar(title,sub,opts){opts=opts||{};
 return '<header class="top wrap'+(opts.palm?' palm':'')+'">'+(opts.back?'<button class="iconbtn ghost" data-a="'+opts.back+'" aria-label="Voltar">'+ic("back",24)+'</button>':'')+
 '<div class="grow"><h1>'+esc(title)+'</h1>'+(sub?'<div class="sub">'+esc(sub)+'</div>':'')+'</div>'+(opts.right||"")+'</header>';
}
function nav(items){var u=S.role?me():null;return '<nav class="nav" aria-label="Menu principal"><div class="nav-brand">'+logo(40)+'<div><b style="display:block">Ed. Marapendi</b><span class="xs muted">'+(S.role==="morador"?esc(u.nome)+" · apto "+u.apto:S.role==="portaria"?"Portaria":esc(u.nome))+'</span></div></div><div class="in-nav">'+items.map(function(it){
 return '<button class="'+(it.on?"on":"")+'" data-a="go" data-v="'+it.v+'" aria-current="'+(it.on?"page":"false")+'">'+ic(it.i,24)+'<span class="nl">'+esc(it.l)+'</span>'+(it.badge?'<span class="badge">'+it.badge+'</span>':'')+'</button>'}).join("")+'</div></nav>'}
function dateBox(s){var d=s2d(s);return '<div class="datebox"><span>'+DOW[d.getDay()]+'</span><b>'+d.getDate()+'</b><span>'+MES3[d.getMonth()]+'</span></div>'}
function empty(txt){return '<div class="card" style="align-items:center;text-align:center;color:var(--muted)">'+esc(txt)+'</div>'}

/* ================= LOGIN ================= */
function vLogin(){
 var L=S.login;
 if(L.step==="cadastro")return vCadastroPub();
 var h='<div class="hero wrap">'+logo(124)+'<div style="font-weight:700;color:var(--palm)">Portal do Condomínio</div></div><main class="wrap page" style="padding-bottom:40px">';
 if(L.step==="email"){
  h+='<div class="stack"><h1 style="font-size:26px;font-weight:800">Entrar</h1><p class="muted">Digite seu e-mail cadastrado. Enviaremos um código de 6 dígitos. Não há senha para lembrar.</p></div>'+
  '<form class="stack g12" data-form="sendcode"><div class="fld"><label class="lbl" for="lg-email">E-mail</label><input id="lg-email" class="in" type="email" autocomplete="email" inputmode="email" autocapitalize="off" spellcheck="false" data-bind="login.email" value="'+esc(L.email)+'"></div>'+
  (L.err?'<div class="errmsg" role="alert">'+esc(L.err)+'</div>':'')+
  '<button class="btn block" type="submit">Enviar código</button></form>'+
  '<p class="small muted" style="text-align:center">Ainda não tem acesso? Procure a administração para cadastrar seu e-mail ou <button class="linkbtn" data-a="cadAbrir">clique aqui para solicitar seu cadastro</button>.</p>';
 }else{
  h+='<div class="stack"><h1 style="font-size:26px;font-weight:800">Digite o código</h1><p class="muted">Se o e-mail <strong>'+esc(L.email)+'</strong> estiver cadastrado, você vai receber um código de 6 dígitos. Ele vale por '+S.cfg.codigoMin+' minutos.</p><p class="small muted">Confira se o e-mail está certo. Se já tem cadastro, não precisa pedir de novo.</p></div>'+
  '<form class="stack g12" data-form="checkcode"><div class="fld"><label class="lbl" for="lg-codigo">Código de 6 dígitos</label><input id="lg-codigo" class="in otp1" inputmode="numeric" autocomplete="one-time-code" maxlength="7" placeholder="000000" data-bind="login.codigo" value="'+esc(L.codigo||"")+'"></div>'+
  (L.err?'<div class="errmsg" role="alert">'+esc(L.err)+'</div>':'')+
  '<button class="btn block" type="submit">Entrar</button><button class="btn out block" type="button" data-a="reenviarCodigo">Enviar um novo código</button><button class="btn ghost block" type="button" data-a="loginback">Usar outro e-mail</button></form>'+
  '<p class="small muted" style="text-align:center">Não recebeu o código? Se você ainda não tem cadastro, <button class="linkbtn" data-a="cadAbrir">solicite aqui</button>.</p>';
 }
 function rb(v,avt,t,sub){return '<button class="rolebtn" data-a="enter" data-v="'+v+'"><span class="av">'+avt+'</span><span class="grow">'+t+'<br><span class="small muted" style="font-weight:500">'+sub+'</span></span>'+ic("next")+'</button>'}
 var cx=S.conexao||{};
 h+='<div class="conexao '+(cx.st||"")+'" role="status"><span class="dotc"></span><span class="grow small">'+(cx.st==="ok"?esc(cx.msg):cx.st==="erro"?"Sem conexão com o servidor. "+esc(cx.msg||""):"Conferindo a conexão com o servidor…")+'</span>'+(cx.st==="erro"?'<button class="btn ghost sm" style="color:var(--sea)" data-a="testarConexao">Tentar de novo</button>':'')+'</div>';
 h+='<div class="demo"><div class="section-title">Só para conhecer · entrar com dados de exemplo</div>'+
 '<div class="xs muted" style="font-weight:700">MORADORES DO MESMO APARTAMENTO (1203)</div>'+
 rb("morador:1","MS","Maria Souza","Proprietária · apto 1203")+rb("morador:2","PS","Pedro Souza","Proprietário · apto 1203")+
 '<div class="xs muted" style="font-weight:700;margin-top:4px">OUTRAS UNIDADES E EQUIPE</div>'+
 rb("morador:8","LC","Luana Costa","Inquilina · apto 1507")+
 rb("portaria",ic("box",18),"Portaria","Acesso único, usado no celular da portaria")+
 rb("sindico:23","RA","Roberto Almeida","Síndico")+rb("sindico:24","AR","Ana Ribeiro","Administração")+
 '<p class="hint">Todos os perfis compartilham os mesmos dados: o que um faz aparece para os outros. Recarregar a página volta aos dados de exemplo.</p></div></main>';
 return h;
}

/* ================= PEDIDOS DE CADASTRO ================= */
var VINCULOS=["Proprietário(a)","Inquilino(a)","Familiar","Dependente maior de idade"];
var TIPOS=["Envelope","Caixa pequena","Caixa média","Caixa grande","Delivery","Outro"];
function novaPessoaCad(){return {nome:"",email:"",tel:"",vinc:"Familiar",wa:false,semTel:false}}
function novoCad(origem,apto){var p=novaPessoaCad();if(origem==="publico")p.vinc="Proprietário(a)";return {origem:origem,apto:apto||"",andar:apto?(Math.floor(parseInt(apto,10)/100)||null):null,pessoas:[p],aceite:false,res:null,robo:""}}
function emailExiste(e){e=String(e||"").trim().toLowerCase();return !!e&&S.usuarios.some(function(u){return u.email&&u.email.toLowerCase()===e&&u.sit!=="Excluído"})}
function emailPendente(e){e=String(e||"").trim().toLowerCase();return S.solicitacoes.some(function(x){return x.status==="pendente"&&x.email.toLowerCase()===e})}
function formCadastro(C,fixo){
 var h='';
 if(fixo){h+='<section class="card tight"><div class="xs muted">Unidade</div><b style="font-size:18px">Apartamento '+esc(C.apto)+(aptoPadrao(C.apto)?' · Lado '+ladoDe(C.apto):'')+'</b></section>'}
 else{
  h+='<section class="card"><h2 class="h2">1. Sua unidade</h2><div class="lbl">Andar</div><div class="grid6">';for(var i=1;i<=S.cfg.andares;i++)h+='<button class="numbtn'+(C.andar===i?" on":"")+'" data-a="cdAndar" data-v="'+i+'" aria-label="'+i+'º andar">'+i+'</button>';h+='</div>';
  if(C.andar){var lado=function(L){var ini=L==="A"?1:S.cfg.porLado+1,o='<div class="stack" style="gap:6px;min-width:0"><div class="xs muted" style="font-weight:800;letter-spacing:.05em">LADO '+L+' · '+faixaLado(L)+'</div><div class="grid3">';for(var k=ini;k<ini+S.cfg.porLado;k++){var n=String(C.andar*100+k);o+='<button class="numbtn'+(C.apto===n?" on":"")+'" data-a="cdApto" data-v="'+n+'" style="height:46px">'+n+'</button>'}return o+'</div></div>'};
   h+='<div class="lbl">Apartamento</div><div class="g2" style="gap:14px">'+lado("A")+lado("B")+'</div>'}
  else h+='<p class="hint">Escolha o andar para ver os apartamentos.</p>';
  h+=(C.apto?'<span class="pill p-sea" style="align-self:flex-start">Apartamento '+C.apto+' · Lado '+ladoDe(C.apto)+'</span>':'')+'</section>';
 }
 h+='<section class="card"><div class="row between"><h2 class="h2">'+(fixo?"Pessoas a incluir":"2. Pessoas")+'</h2><span class="pill p-sea">'+C.pessoas.length+' de '+S.cfg.cadPessoas+'</span></div><p class="small muted">'+(fixo?"Só maiores de 18 anos. Cada pessoa entra no app com o próprio e-mail.":"A pessoa 1 é você. Pode incluir outros moradores maiores de 18 anos da mesma unidade.")+'</p>';
 C.pessoas.forEach(function(p,i){var b="cad.pessoas."+i,id="cd-p"+i;
  h+='<div class="card tight" style="background:var(--bg)"><div class="row between"><b>'+(!fixo&&i===0?"Pessoa 1 (você)":"Pessoa "+(i+1))+'</b>'+(C.pessoas.length>1?'<button class="btn ghost sm" style="color:var(--bad)" data-a="cdRem" data-v="'+i+'">Remover</button>':'')+'</div>'+
  '<div class="fld"><label class="lbl" for="'+id+'-n">Nome completo</label><input id="'+id+'-n" class="in" data-bind="'+b+'.nome" value="'+esc(p.nome)+'" autocomplete="off"></div>'+
  '<div class="fld"><label class="lbl" for="'+id+'-e">E-mail (será o login)</label><input id="'+id+'-e" class="in" type="email" data-bind="'+b+'.email" value="'+esc(p.email)+'" autocomplete="off"></div>'+
  '<div class="g2"><div class="fld"><label class="lbl" for="'+id+'-t">Telefone</label><input id="'+id+'-t" class="in" inputmode="tel" data-bind="'+b+'.tel" value="'+esc(p.semTel?"":p.tel)+'" placeholder="'+(p.semTel?"Sem telefone":"(21) 9…")+'"'+(p.semTel?" disabled":"")+'></div><div class="fld"><label class="lbl" for="'+id+'-v">Vínculo</label><select id="'+id+'-v" class="in" data-bind="'+b+'.vinc">'+VINCULOS.map(function(v){return '<option'+(p.vinc===v?" selected":"")+'>'+v+'</option>'}).join("")+'</select></div></div>'+
  '<label class="row"><input type="checkbox" data-a="cdSemTel" data-v="'+i+'" '+(p.semTel?"checked":"")+' style="width:22px;height:22px;margin:0;flex-shrink:0;accent-color:var(--sea)"><span class="small">Não tenho telefone</span></label>'+
  (p.semTel?'':'<label class="row" style="align-items:flex-start"><input type="checkbox" data-a="cdWa" data-v="'+i+'" '+(p.wa?"checked":"")+' style="width:22px;height:22px;margin:0;flex-shrink:0;accent-color:var(--sea)"><span class="small">Aceita receber aviso de encomendas por WhatsApp neste telefone.</span></label>')+'</div>';
 });
 if(C.pessoas.length<S.cfg.cadPessoas)h+='<button class="btn out sm" data-a="cdAdd">+ Adicionar pessoa</button>';
 h+='</section>';
 h+='<label class="row" style="align-items:flex-start"><input type="checkbox" id="cd-aceite" data-a="cdAceite" '+(C.aceite?"checked":"")+' style="width:24px;height:24px;margin:0;flex-shrink:0;accent-color:var(--sea)"><span class="small">Autorizo o uso destes dados somente para o cadastro no app do Ed. Marapendi.'+(fixo?" Confirmo que as pessoas incluídas concordaram.":"")+'</span></label>'+
 '<input id="cd-robo" type="text" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px;width:1px;height:1px" data-bind="cad.robo" value="">'+
 (S.ui.errForm?'<div class="errmsg" role="alert">'+esc(S.ui.errForm)+'</div>':'')+
 '<button class="btn block" data-a="cdEnviar">Enviar pedido</button>';
 return h;
}
function cadResultado(C){
 var algum=C.res.some(function(r){return r.st==="ok"});
 return '<section class="card"><h2 class="h2">'+(algum?"Pedido enviado":"Nenhum pedido novo")+'</h2><div class="list">'+C.res.map(function(r){var m={ok:["Pedido enviado para a administração. A resposta chega no e-mail informado.","p-ok","Enviado"],tem:["Este e-mail já tem acesso ao app. Basta entrar com ele.","p-sea","Já tem acesso"],pend:["Já existe um pedido em análise para este e-mail.","p-warn","Em análise"]}[r.st];return '<div class="li" style="align-items:flex-start"><span class="grow"><b>'+esc(r.nome)+'</b><span class="xs muted" style="display:block">'+esc(r.email)+'</span><span class="small" style="display:block;margin-top:4px">'+m[0]+'</span></span><span class="pill '+m[1]+'">'+m[2]+'</span></div>'}).join("")+'</div></section>';
}
function vCadastroPub(){
 var C=S.cad||(S.cad=novoCad("publico"));
 var h='<header class="top wrap"><button class="iconbtn ghost" data-a="cdVoltar" aria-label="Voltar">'+ic("back",24)+'</button><div class="grow"><h1>Solicitar cadastro</h1><div class="sub">Ed. Marapendi</div></div></header><main class="wrap page" style="padding-bottom:40px">';
 if(C.res)return h+cadResultado(C)+'<button class="btn block" data-a="cdVoltar">Voltar para a entrada</button></main>';
 return h+'<div class="note">'+ic("info",20)+'<span>A administração confere os dados e aprova o cadastro. A resposta chega no e-mail informado. Depois disso, é só entrar no app com o e-mail.</span></div>'+formCadastro(C,false)+'</main>';
}
function mInclusao(){
 var u=me(),C=S.cad||(S.cad=novoCad("morador",u.apto));
 var h=topbar("Pedir inclusão de morador","Apartamento "+u.apto,{back:"cdVoltarPerfil"})+'<main class="wrap page">';
 if(C.res)return h+cadResultado(C)+'<button class="btn block" data-a="cdVoltarPerfil">Voltar ao perfil</button></main>';
 return h+'<div class="note">'+ic("info",20)+'<span>A administração analisa o pedido. Você recebe a resposta aqui no app, e cada pessoa aprovada recebe um e-mail com o link do app.</span></div>'+formCadastro(C,true)+'</main>';
}
function solPill(st){var m={pendente:["Em análise","p-warn"],aprovada:["Aprovada","p-ok"],reprovada:["Reprovada","p-bad"]}[st];return '<span class="pill '+m[1]+'">'+m[0]+'</span>'}
function pedidos(){var g={},o=[];S.solicitacoes.forEach(function(x){if(!g[x.pedido]){g[x.pedido]={id:x.pedido,origem:x.origem,solicitante:x.solicitante,apto:x.apto,criado:x.criado,pessoas:[]};o.push(g[x.pedido])}g[x.pedido].pessoas.push(x)});return S.real?o:o.sort(function(a,b){return b.id-a.id})}
function solPendentes(){return S.solicitacoes.filter(function(x){return x.status==="pendente"}).length}
function alertasSol(x,E){if(S.real)return x.alertas||[];var a=[],em=(E.email||"").trim().toLowerCase();
 if(!/\S+@\S+\.\S+/.test(em))a.push("E-mail inválido.");
 else if(emailExiste(em))a.push("Este e-mail já tem cadastro no app.");
 if(S.solicitacoes.some(function(y){return y.id!==x.id&&y.status==="pendente"&&y.email.toLowerCase()===em}))a.push("O mesmo e-mail está em outro pedido em análise.");
 if(!aptoValido(x.apto))a.push("Unidade inexistente.");
 if(/^Propriet/.test(E.vinc)&&moradoresDe(x.apto).some(function(m){return /^Propriet/.test(m.vinculo||"")}))a.push("A unidade já tem proprietário cadastrado. Confira se é um segundo proprietário.");
 return a}
function sSolicitacoes(){
 var ps=pedidos(),h='';
 if(S.ui.pedId){var P=ps.filter(function(p){return String(p.id)===String(S.ui.pedId)})[0];if(P)return sPedidoDet(P)}
 if(S.ui.okSol)h+='<div class="okmsg" role="status">'+esc(S.ui.okSol)+'</div>';
 var fil=S.ui.filSol||"pend",l=ps.filter(function(p){var pend=p.pessoas.some(function(x){return x.status==="pendente"});return fil==="pend"?pend:!pend});
 h+='<p class="small muted">Pedidos feitos pela tela de entrada ou por moradores no app. Confira os dados e aprove ou reprove cada pessoa.</p><div class="chips">'+[["pend","Em análise"],["dec","Decididos"]].map(function(x){return '<button class="chip'+(fil===x[0]?" on":"")+'" data-a="filSol" data-v="'+x[0]+'">'+x[1]+'</button>'}).join("")+'</div>';
 h+=l.length?l.map(function(p){var np=p.pessoas.filter(function(x){return x.status==="pendente"}).length;return '<button class="card" style="text-align:left" data-a="abrirPed" data-v="'+p.id+'"><div class="row between wrapr"><b style="font-size:18px;color:var(--sea-strong)">Apto '+esc(p.apto)+'</b>'+(np?'<span class="pill p-warn">'+np+(np>1?" pessoas em análise":" pessoa em análise")+'</span>':'<span class="pill p-off">Decidido</span>')+'</div><div class="small">'+esc(p.pessoas.map(function(x){return x.nome}).join(", "))+'</div><div class="xs muted">'+(p.origem==="publico"?"Pela tela de entrada":"Pedido por "+esc(p.solicitante)+" no app")+' · '+esc(p.criado)+'</div></button>'}).join(""):empty(fil==="pend"?"Nenhum pedido em análise.":"Nenhum pedido decidido ainda.");
 return h;
}
function sPedidoDet(P){
 var mor=S.real?(S.srvMor[P.id]||[]).map(function(m){return {nome:m.nome,vinculo:m.vinculo,sit:m.situacao}}):moradoresDe(P.apto),np=P.pessoas.filter(function(x){return x.status==="pendente"}).length;
 if(!S.ui.solEd)S.ui.solEd={};
 var h='<button class="btn ghost sm" style="align-self:flex-start;color:var(--sea);padding-left:0" data-a="fechaPed">'+ic("back",18)+'Todos os pedidos</button>';
 if(S.ui.okSol)h+='<div class="okmsg" role="status">'+esc(S.ui.okSol)+'</div>';
 h+='<section class="card"><div class="row between wrapr"><b style="font-size:20px;color:var(--sea-strong)">Apto '+esc(P.apto)+(aptoPadrao(P.apto)?' · Lado '+ladoDe(P.apto):'')+'</b><span class="xs muted">'+esc(P.criado)+'</span></div><div class="small">'+(P.origem==="publico"?"Pedido feito pela tela de entrada, sem login":"Pedido feito no app por <b>"+esc(P.solicitante)+"</b>, morador da unidade")+'</div>'+
 '<div class="xs muted" style="font-weight:700;margin-top:4px">MORADORES JÁ CADASTRADOS NA UNIDADE</div>'+(mor.length?'<div class="list">'+mor.map(function(m){return '<div class="li" style="min-height:40px"><span class="av" style="width:32px;height:32px;font-size:12px">'+esc(ini(m.nome))+'</span><span class="grow small"><b>'+esc(m.nome)+'</b> · '+esc(m.vinculo||"")+'</span>'+sitPill(m.sit)+'</div>'}).join("")+'</div>':'<p class="small muted">Nenhum morador cadastrado nesta unidade.</p>')+'</section>';
 if(np>1)h+='<button class="btn okb block" data-a="solAprovarTodos" data-v="'+P.id+'">Aprovar todos ('+np+')</button>';
 P.pessoas.forEach(function(x){
  if(x.status==="pendente"){if(!S.ui.solEd[x.id])S.ui.solEd[x.id]={nome:x.nome,email:x.email,tel:x.tel,vinc:x.vinc};var E=S.ui.solEd[x.id],b="ui.solEd."+x.id,id="sl"+x.id,al=alertasSol(x,E);
   h+='<section class="card"><div class="row between"><b>'+esc(x.nome)+'</b>'+solPill(x.status)+'</div>'+al.map(function(t){return '<div class="errmsg" style="padding:8px 12px">'+esc(t)+'</div>'}).join("")+
   '<div class="fld"><label class="lbl" for="'+id+'n">Nome completo</label><input id="'+id+'n" class="in" data-bind="'+b+'.nome" value="'+esc(E.nome)+'"></div>'+
   '<div class="fld"><label class="lbl" for="'+id+'e">E-mail</label><input id="'+id+'e" class="in" type="email" data-bind="'+b+'.email" data-rerender="1" value="'+esc(E.email)+'"></div>'+
   '<div class="g2"><div class="fld"><label class="lbl" for="'+id+'t">Telefone</label><input id="'+id+'t" class="in" data-bind="'+b+'.tel" value="'+esc(E.tel)+'"></div><div class="fld"><label class="lbl" for="'+id+'v">Vínculo</label><select id="'+id+'v" class="in" data-bind="'+b+'.vinc">'+VINCULOS.map(function(v){return '<option'+(E.vinc===v?" selected":"")+'>'+v+'</option>'}).join("")+'</select></div></div>'+
   '<div class="xs muted">'+(x.semTel?"Declarou não ter telefone":"WhatsApp: "+(x.wa?"autorizado":"não autorizado"))+' · consentimento registrado em '+esc(x.criado)+'</div>'+
   '<div class="g2"><button class="btn okb" data-a="solAprovar" data-v="'+x.id+'">Aprovar</button><button class="btn badb" data-a="solReprovar" data-v="'+x.id+'">Reprovar</button></div></section>';
  }else{
   h+='<section class="card tight"><div class="row between"><b>'+esc(x.nome)+'</b>'+solPill(x.status)+'</div><div class="small muted">'+esc(x.email)+' · '+esc(x.vinc)+'</div><div class="xs muted">'+(x.status==="aprovada"?"Aprovada":"Reprovada")+' por '+esc(x.decididoPor)+' em '+esc(x.decididoEm)+(x.motivo?' · motivo interno: '+esc(x.motivo):'')+'</div></section>';
  }
 });
 return h;
}
function aprovarSol(x){var E=(S.ui.solEd&&S.ui.solEd[x.id])||{nome:x.nome,email:x.email,tel:x.tel,vinc:x.vinc},em=E.email.trim();
 if(!E.nome.trim())return x.nome+": informe o nome.";
 if(!/\S+@\S+\.\S+/.test(em))return x.nome+": e-mail inválido.";
 if(emailExiste(em))return x.nome+": este e-mail já tem cadastro. Ajuste o e-mail ou reprove.";
 if(!aptoValido(x.apto))return x.nome+": unidade inexistente.";
 var q=quandoAgora(),u=me();
 S.usuarios.push({id:uid(),apto:aptoNorm(x.apto),nome:E.nome.trim(),email:em,tel:E.tel||"",wa:!!x.wa&&!!soDig(E.tel),perfil:"morador",vinculo:E.vinc,sit:"Convite pendente",avEmail:true});
 x.nome=E.nome.trim();x.email=em;x.tel=E.tel;x.vinc=E.vinc;x.status="aprovada";x.decididoPor=u.nome;x.decididoEm=q;
 if(x.origem==="morador")notify(x.apto,x.nome+" foi aprovado(a) pela administração e já pode entrar no app.","perfil");
 audit("Aprovou cadastro",x.nome+" · apto "+x.apto+" · "+x.vinc);return "";
}

/* ================= MORADOR ================= */
function minhasEnc(st){var u=me();return S.encomendas.filter(function(e){return e.apto===u.apto&&e.status===st})}
function meusAvisosNaoLidos(){var u=me();return S.notifs.filter(function(n){return n.apto===u.apto&&!n.lida}).length}
function vMorador(){
 var sc=S.screen||"inicio", body="";
 if(sc==="inicio")body=mInicio();
 else if(sc==="reservas")body=mReservas();
 else if(sc==="reserva")body=mReservaDet();
 else if(sc==="encomendas")body=mEncomendas();
 else if(sc==="perfil")body=mPerfil();
 else if(sc==="avisos")body=mAvisos();
 else if(sc==="loc")body=mLoc();
 else if(sc==="locNova")body=mLocNova();
 else if(sc==="locDet")body=mLocDet();
 else if(sc==="inclusao")body=mInclusao();
 var pend=minhasEnc("pendente").length;
 return body+nav([{v:"inicio",i:"home",l:"Início",on:sc==="inicio"||sc==="avisos"},{v:"reservas",i:"cal",l:"Reservas",on:sc==="reservas"||sc==="reserva"},{v:"encomendas",i:"box",l:"Encomendas",on:sc==="encomendas",badge:pend||""},{v:"loc",i:"key",l:"Locação",on:/^loc/.test(sc)},{v:"perfil",i:"user",l:"Perfil",on:sc==="perfil"||sc==="inclusao"}]);
}
function mInicio(){
 var u=me(),pend=minhasEnc("pendente"),na=meusAvisosNaoLidos();
 var prox=S.reservas.filter(function(r){return r.apto===u.apto&&r.data>=TODAY&&ativa(r)}).sort(function(a,b){return a.data<b.data?-1:1});
 var h='<header class="top wrap" style="min-height:76px">'+logo(48)+'<div class="grow"><h1>Olá, '+esc(u.nome.split(" ")[0])+'</h1><div class="sub">'+esc(unExtra(u.apto)?unExtra(u.apto).nome:"Apartamento "+u.apto+" · Lado "+ladoDe(u.apto))+'</div></div>'+
 '<button class="iconbtn" data-a="go" data-v="avisos" aria-label="Avisos'+(na?", "+na+" novos":"")+'">'+ic("bell")+(na?'<span class="dot">'+na+'</span>':'')+'</button></header><main class="wrap page">';
 if(pend.length){
  h+='<button class="big-cta" data-a="go" data-v="encomendas"><span class="tile" style="background:var(--bg)">'+ic("box",28)+'</span><span class="grow"><span style="display:block;font-size:17px;font-weight:800">'+pend.length+(pend.length>1?" encomendas":" encomenda")+' na portaria</span><span class="small">Última: '+esc(quando(pend[0].data,pend[0].hora))+' · '+esc(pend[0].tipo)+'</span></span>'+ic("next")+'</button>';
 }else{
  h+='<div class="card" style="flex-direction:row;align-items:center"><span class="tile" style="background:var(--ok-soft);color:var(--ok)">'+ic("check")+'</span><span>Nenhuma encomenda aguardando retirada.</span></div>';
 }
 h+='<div class="g2"><button class="quick sea" data-a="novaRes">'+ic("calplus",26)+'Nova reserva</button><button class="quick" data-a="go" data-v="locNova">'+ic("key",26)+'Pedir locação / temporada</button></div>';
 var ml=S.locacoes.filter(function(l){return l.apto===u.apto&&["pendente","aprovada","andamento"].indexOf(locSt(l))>=0});
 ml.forEach(function(l){h+='<button class="card" style="flex-direction:row;align-items:center;text-align:left" data-a="abrirLoc" data-v="'+l.id+'"><span class="tile" style="background:var(--sea-soft);color:var(--sea-strong)">'+ic("key",24)+'</span><span class="grow stack" style="gap:3px"><b>Locação / temporada</b><span class="small muted">'+esc(periodo(l))+' · '+l.pessoas.length+(l.pessoas.length>1?" hóspedes":" hóspede")+'</span><span>'+locPill(l)+'</span></span></button>'});
 h+='<section class="stack g12"><div class="row between"><h2 class="h2">Próximas reservas do apto '+u.apto+'</h2><button class="btn ghost sm" data-a="minhasRes" style="color:var(--sea)">Ver todas</button></div>';
 if(!prox.length)h+=empty("O apartamento não tem reservas futuras.");
 prox.slice(0,3).forEach(function(r){var a=area(r.area);
  h+='<button class="card" style="flex-direction:row;align-items:center;text-align:left" data-a="abrirRes" data-v="'+r.id+'">'+dateBox(r.data)+'<span class="grow stack" style="gap:3px"><b style="font-size:16px">'+esc(a.nome)+'</b><span class="small muted">'+esc(turnoLabel(a,r.turno))+'</span><span class="xs muted">'+(r.por&&r.por!==u.nome?"Feita por "+esc(r.por.split(" ")[0])+" · ":"")+(r.convidados.length?r.convidados.length+" convidados":"Sem convidados ainda")+'</span><span>'+statusPill(r.status)+'</span></span></button>';
 });
 return h+'</section></main>';
}
function mAvisos(){
 var u=me(),l=S.notifs.filter(function(n){return n.apto===u.apto});
 var h=topbar("Avisos","Apartamento "+u.apto,{back:"goInicio",right:l.some(function(n){return !n.lida})?'<button class="btn ghost sm" data-a="lerTudo" style="color:var(--sea)">Marcar como lidos</button>':""})+'<main class="wrap page">';
 if(!l.length)h+=empty("Nenhum aviso por aqui.");
 else h+='<div class="card tight"><div class="list">'+l.map(function(n){return '<button class="li" data-a="abrirAviso" data-v="'+n.id+'"><span class="tile" style="width:40px;height:40px;'+(n.lida?'background:var(--sunk);color:var(--muted)':'')+'">'+ic(n.ir==="encomendas"?"box":n.ir==="loc"?"key":"cal",20)+'</span><span class="grow"><span style="display:block;font-weight:'+(n.lida?500:800)+'">'+esc(n.txt)+'</span><span class="xs muted">'+esc(n.q)+'</span></span>'+(n.lida?'':'<span class="pill p-bad">Novo</span>')+'</button>'}).join("")+'</div></div>';
 h+='<p class="xs muted">Os avisos aparecem aqui mesmo quando o e-mail não chega.</p>';
 return h+'</main>';
}
function mEncomendas(){
 var u=me(),tab=S.ui.encTab||"pend",pend=minhasEnc("pendente"),ret=minhasEnc("retirada");
 var h=topbar("Encomendas","Apartamento "+u.apto)+'<main class="wrap page"><div class="seg" role="tablist"><button role="tab" class="'+(tab==="pend"?"on":"")+'" data-a="encTab" data-v="pend">Na portaria ('+pend.length+')</button><button role="tab" class="'+(tab==="ret"?"on":"")+'" data-a="encTab" data-v="ret">Retiradas</button></div>';
 if(tab==="pend"){
  h+='<div class="note">'+ic("info",20)+'<span>Retire na portaria. Qualquer morador do apartamento pode retirar. O código serve só para conferência.</span></div>';
  if(!pend.length)h+=empty("Nenhuma encomenda aguardando retirada.");
  pend.forEach(function(e){
   h+='<article class="card"><div class="row"><span class="tile">'+ic("box",26)+'</span><div class="grow"><b style="font-size:16px">'+esc(e.tipo)+'</b><div class="small muted">'+esc(e.rem||"Remetente não informado")+'</div></div><span class="pill p-warn">Aguardando</span></div>'+
   '<div class="g2 small"><div><div class="muted">Chegou</div><b>'+esc(quando(e.data,e.hora))+'</b></div><div><div class="muted">Recebida por</div><b>'+esc(e.porteiro.split(" ")[0])+'</b></div></div>'+
   '<div class="row between" style="border-top:1px dashed var(--line);padding-top:12px"><div><div class="xs muted">Código</div><div class="code">'+e.cod+'</div></div><button class="btn out sm" data-a="verFoto" data-v="'+e.id+'">'+ic("cam",18)+'Ver foto</button></div></article>';
  });
 }else{
  if(!ret.length)h+=empty("Nenhuma retirada registrada.");
  else h+='<div class="card tight"><div class="list">'+ret.map(function(e){return '<div class="li"><span class="tile" style="width:40px;height:40px;background:var(--ok-soft);color:var(--ok)">'+ic("check",20)+'</span><span class="grow"><b>'+esc(e.tipo)+' · '+esc(e.rem)+'</b><span class="xs muted" style="display:block">Retirada '+esc(e.em)+' por '+esc(e.por)+'</span></span></div>'}).join("")+'</div></div>';
 }
 return h+'</main>';
}
function calendario(a,y,m,sel,acao,adm){
 var first=new Date(y,m,1),dias=new Date(y,m+1,0).getDate(),h='<div class="cal">'+["D","S","T","Q","Q","S","S"].map(function(d){return '<span class="dw" aria-hidden="true">'+d+'</span>'}).join("");
 for(var i=0;i<first.getDay();i++)h+='<span></span>';
 for(var d=1;d<=dias;d++){var ds=y+"-"+pad(m+1)+"-"+pad(d),st=diaStatus(a,ds,null,adm),cls=st==="livre"?(sel===ds?"sel":""):st+(sel===ds&&adm==="ver"?" pick":"");
  var lab={livre:"livre",ocup:"reservado",bloq:"bloqueado",ind:"indisponível"}[st];
  h+='<button class="'+cls+'" data-a="'+acao+'" data-v="'+ds+'" '+(st==="livre"||(adm==="ver"&&st!=="ind")?"":"aria-disabled=\"true\"")+' aria-label="'+d+' de '+MES[m]+', '+(sel===ds?"selecionado":lab)+'">'+d+'</button>'}
 return h+'</div>';
}
function navMes(y,m,acao){return '<div class="row" style="gap:0"><button class="iconbtn ghost" data-a="'+acao+'" data-v="-1" aria-label="Mês anterior">'+ic("back",20)+'</button><b style="min-width:120px;text-align:center;text-transform:capitalize">'+MES[m]+' '+y+'</b><button class="iconbtn ghost" data-a="'+acao+'" data-v="1" aria-label="Próximo mês">'+ic("next",20)+'</button></div>'}
function legendaCal(){return '<div class="legend"><span><i style="border:1.5px solid var(--line2)"></i>Livre</span><span><i style="background:var(--off-soft)"></i>Reservado</span><span><i style="background:var(--bad-soft)"></i>Bloqueado</span></div>'}
function mudaMes(o,v){var m=o.cm+ +v,y=o.cy;if(m<0){m=11;y--}if(m>11){m=0;y++}var k=y*12+m,h=mesAtual(),k0=S.real?h.y*12+h.m:2026*12+9;if(k<k0||k>k0+14)return;o.cm=m;o.cy=y}
function calAdmin(){
 var f=S.f,a=area(f.area);if(!a)return empty("Cadastre um espaço em Mais › Áreas comuns.");
 var h='<section class="card" style="border:2px solid var(--sea)"><div class="row between"><h2 class="h2">Calendário de reservas</h2><button class="iconbtn ghost" data-a="sFechaForm" aria-label="Fechar">'+ic("x")+'</button></div>'+
 '<div class="chips">'+S.areas.filter(function(x){return x.ativo}).map(function(x){return '<button class="chip'+(x.id===f.area?" on":"")+'" data-a="fArea" data-v="'+x.id+'">'+esc(x.nome)+'</button>'}).join("")+'</div>'+
 '<div class="row between"><span class="lbl" style="margin:0">'+esc(a.nome)+'</span>'+navMes(f.cy,f.cm,"fMes")+'</div>'+
 calendario(a,f.cy,f.cm,f.data,"calDia","ver")+legendaCal()+'<p class="hint">Toque em um dia para ver quem reservou ou o motivo do bloqueio.</p>';
 if(f.data){var st=diaStatus(a,f.data,null,true),rs=S.reservas.filter(function(r){return r.area===a.id&&r.data===f.data&&ativa(r)}),b=bloqueio(a.id,f.data);
  h+='<div class="card tight" style="background:var(--bg)"><b>'+fmtLong(f.data)+'</b>';
  if(b)h+='<div class="row between wrapr"><span class="pill p-bad">Bloqueado</span><span class="xs muted">por '+esc(b.autor)+'</span></div><div class="small">'+esc(b.motivo)+'</div>';
  rs.forEach(function(r){h+='<div class="row between wrapr"><span class="small"><b>Apto '+r.apto+'</b> · '+esc(r.nome)+'<span class="xs muted" style="display:block">'+esc(turnoLabel(a,r.turno))+'</span></span>'+statusPill(r.status)+'</div>'});
  if(!b&&st==="livre")h+='<div class="small">'+(rs.length?"Ainda há turno livre neste dia.":"Dia livre.")+'</div><button class="btn sm" data-a="calIncluir">'+ic("calplus",18)+'Incluir reserva neste dia</button>';
  h+='</div>';
 }
 return h+'</section>';
}
function mReservas(){
 var tab=S.ui.resTab||"nova",u=me();
 var h=topbar("Reservas","Áreas comuns do condomínio")+'<main class="wrap page"><div class="seg" role="tablist"><button role="tab" class="'+(tab==="nova"?"on":"")+'" data-a="resTab" data-v="nova">Nova reserva</button><button role="tab" class="'+(tab==="minhas"?"on":"")+'" data-a="resTab" data-v="minhas">Do apartamento</button></div>';
 if(tab==="minhas"){
  var l=S.reservas.filter(function(r){return r.apto===u.apto}).sort(function(a,b){return a.data<b.data?1:-1});
  h+='<p class="small muted">Reservas feitas por qualquer morador do apto '+u.apto+'. Todos podem ver e cadastrar convidados.</p>';if(!l.length)h+=empty("Nenhuma reserva ainda.");
  l.forEach(function(r){var a=area(r.area);h+='<button class="card" style="flex-direction:row;align-items:center;text-align:left'+(r.data<TODAY?';opacity:.7':'')+'" data-a="abrirRes" data-v="'+r.id+'">'+dateBox(r.data)+'<span class="grow stack" style="gap:3px"><b style="font-size:16px">'+esc(a.nome)+'</b><span class="small muted">'+esc(turnoLabel(a,r.turno))+'</span><span class="xs muted">Feita por '+esc(r.por===u.nome?"você":r.por||r.nome)+'</span><span>'+statusPill(r.status)+'</span></span></button>'});
  return h+'</main>';
 }
 if(!area((S.nr||{}).area))S.nr=null;
 var N=S.nr||(S.nr=S.real?{area:areaPadrao(),y:mesAtual().y,m:mesAtual().m,data:null,turno:null,aceite:false}:{area:"churras",y:2026,m:10,data:null,turno:null,aceite:false});
 var a=area(N.area);if(!a)return h+empty("Nenhum espaço disponível para reserva no momento.")+'</main>';
 h+='<section class="stack"><div class="lbl">1. Escolha o espaço</div><div class="g2">'+S.areas.filter(function(x){return x.ativo}).map(function(x){var on=x.id===N.area;
  return '<button class="optcard'+(on?" on":"")+'" data-a="nrArea" data-v="'+x.id+'"><b style="font-size:16px">'+esc(x.nome)+'</b><span class="small">Até '+x.cap+' pessoas</span><b>'+brl(x.preco)+'</b></button>'}).join("")+'</div></section>';
 h+='<section class="stack"><div class="row between"><div class="lbl">2. Escolha a data</div><div class="row" style="gap:0"><button class="iconbtn ghost" data-a="nrMes" data-v="-1" aria-label="Mês anterior">'+ic("back",20)+'</button><b style="min-width:120px;text-align:center;text-transform:capitalize">'+MES[N.m]+' '+N.y+'</b><button class="iconbtn ghost" data-a="nrMes" data-v="1" aria-label="Próximo mês">'+ic("next",20)+'</button></div></div>'+
 '<div class="card" style="padding:12px">'+calendario(a,N.y,N.m,N.data,"nrDia")+'<div class="legend"><span><i style="border:1.5px solid var(--line2)"></i>Livre</span><span><i style="background:var(--off-soft)"></i>Reservado</span><span><i style="background:var(--bad-soft)"></i>Bloqueado</span></div></div>'+
 '<p class="hint">Reservas com '+a.antMin+' a '+a.antMax+' dias de antecedência.</p></section>';
 h+='<section class="stack"><div class="lbl">3. Período</div>';
 if(a.modo==="integral")h+='<div class="chips"><span class="chip on" style="display:inline-flex;align-items:center">'+esc(turnoLabel(a,"integral"))+'</span></div><p class="hint">Este espaço é reservado por período integral.</p>';
 else h+='<div class="chips">'+a.turnos.map(function(t){var oc=N.data&&conflito(a.id,N.data,t.id);return '<button class="chip'+(N.turno===t.id?" on":"")+'" data-a="nrTurno" data-v="'+t.id+'" '+(oc?'disabled style="opacity:.45;text-decoration:line-through"':'')+'>'+esc(turnoLabel(a,t.id))+'</button>'}).join("")+'</div>';
 h+='</section>';
 var turno=a.modo==="integral"?"integral":N.turno, pronto=N.data&&turno&&N.aceite;
 h+='<section class="card"><h2 class="h2">Resumo</h2>'+
 '<div class="row between small"><span class="muted">Espaço</span><b>'+esc(a.nome)+'</b></div>'+
 '<div class="row between small"><span class="muted">Data</span><b>'+(N.data?fmtD(N.data):"Escolha no calendário")+'</b></div>'+
 '<div class="row between small"><span class="muted">Período</span><b>'+(turno?esc(turnoLabel(a,turno)):"Escolha o turno")+'</b></div>'+
 '<div class="row between small" style="border-top:1px dashed var(--line);padding-top:10px"><span class="muted">Taxa (no boleto do condomínio)</span><b>'+brl(a.preco)+'</b></div>'+
 (a.manual?'<div class="pill p-warn" style="white-space:normal;padding:8px 12px">Este espaço precisa de aprovação do síndico ou da administração.</div>':'<div class="pill p-ok" style="white-space:normal;padding:8px 12px">'+ic("check",16)+'&nbsp;Confirmação imediata: este espaço não exige aprovação.</div>')+'</section>';
 h+='<label class="row" style="align-items:flex-start"><input type="checkbox" id="nr-aceite" data-a="nrAceite" '+(N.aceite?"checked":"")+' style="width:24px;height:24px;margin:0;flex-shrink:0;accent-color:var(--sea)"><span class="small">'+(a.temTermo?(termoUrl(a)?'Li e aceito o <a href="'+termoUrl(a)+'" target="_blank" rel="noopener">termo de uso (PDF)</a>':'Li e aceito o <a href="#" data-a="abrirTermo" data-v="'+a.id+'">termo de uso (PDF)</a>'):'Li e aceito as <a href="#" data-a="verTermos" data-v="'+a.id+'">regras de uso do espaço</a>')+'. Cancelamento sem custo até '+a.canc+' h antes.</span></label>';
 if(S.real&&a.temTermo&&!termoUrl(a))carregarTermo(a,false);
 h+='<button class="btn block" data-a="nrConfirmar" '+(pronto?"":"disabled")+'>'+(a.manual?"Enviar pedido de reserva":"Confirmar reserva")+'</button>';
 if(!pronto)h+='<p class="hint" style="text-align:center">'+(!N.data?"Escolha uma data livre.":!turno?"Escolha o turno.":"Aceite os termos para continuar.")+'</p>';
 return h+'</main>';
}
function mReservaDet(){
 var r=resPorId(S.ui.resId);if(!r||!area(r.area)){S.screen="reservas";return mReservas()}
 var a=area(r.area),f=S.f;
 var h=topbar(a.nome,fmtLong(r.data),{back:"minhasRes"})+'<main class="wrap page"><section class="card"><div class="row between"><b>Situação</b>'+statusPill(r.status)+'</div>'+
 '<div class="row between small"><span class="muted">Período</span><b>'+esc(turnoLabel(a,r.turno))+'</b></div>'+
 '<div class="row between small"><span class="muted">Taxa</span><b>'+(r.isenta?"Isenta":brl(r.taxa!=null?r.taxa:a.preco))+'</b></div>'+
 '<div class="row between small"><span class="muted">Feita por</span><b>'+esc(r.por===me().nome?"Você":r.por||r.nome)+'</b></div>'+
 (r.origem?'<div class="xs" style="color:var(--sea-strong);font-weight:700">'+esc(r.origem)+'</div>':'')+
 (r.status==="aguardando"?'<p class="small muted">Você será avisado por e-mail e aqui no app quando a administração responder.</p>':'')+(r.motivo&&(r.status==="recusada"||r.status==="cancelada")?'<div class="small"><span class="muted">Motivo: </span>'+esc(r.motivo)+'</div>':'')+'</section>';
 if(ativa(r)){
  h+='<section class="card"><div class="row between"><h2 class="h2">Lista de convidados</h2><span class="pill p-sea">'+r.convidados.length+' / '+a.cap+'</span></div>';
  h+=r.convidados.length?'<div class="list">'+r.convidados.map(function(c,i){return '<div class="li"><span class="av">'+esc(ini(c.n))+'</span><span class="grow"><b>'+esc(c.n)+'</b>'+(c.d?'<span class="xs muted" style="display:block">Doc. '+esc(c.d)+'</span>':'')+'</span><button class="iconbtn ghost" data-a="remConv" data-v="'+i+'" aria-label="Remover '+esc(c.n)+'">'+ic("x",20)+'</button></div>'}).join("")+'</div>':'<p class="small muted">Nenhum convidado ainda. A portaria só libera a entrada de quem estiver na lista.</p>';
  h+='<form class="stack" data-form="addConv"><div class="fld"><label class="lbl" for="cv-n">Nome do convidado</label><input id="cv-n" class="in" data-bind="f.cn" value="'+esc(f.cn||"")+'" placeholder="Nome e sobrenome"></div><div class="fld"><label class="lbl" for="cv-d">Documento (opcional)</label><input id="cv-d" class="in" data-bind="f.cd" value="'+esc(f.cd||"")+'" placeholder="RG ou CPF"></div><button class="btn out" type="submit">Adicionar à lista</button></form></section>';
  if(r.data>=TODAY){
   h+=podeCancelar(r)?'<button class="btn badb block" data-a="pedirCancel" data-v="'+r.id+'">Cancelar reserva</button>':'<p class="small muted" style="text-align:center">O prazo para cancelar sem custo ('+a.canc+' h antes) já passou. Fale com a administração.</p>';
  }
 }
 return h+'</main>';
}
function mPerfil(){
 var u=me(),cad=S.real&&S.perfilSrv?S.perfilSrv.moradores.map(function(m){return {nome:m.nome,vinculo:m.vinculo,sit:m.situacao,id:m.eu?u.id:"x"}}):moradoresDe(u.apto),av=S.ui.av||(S.ui.av={enc:true,res:true,lem:true});
 var h=topbar("Meu perfil")+'<main class="wrap page">'+
 '<section class="card" style="background:var(--sun);color:var(--on-sun);border-color:var(--sun);flex-direction:row;align-items:center"><span class="av" style="width:58px;height:58px;border-radius:29px;font-size:20px;background:var(--bg);color:var(--palm)">'+esc(ini(u.nome))+'</span><span class="grow"><b style="font-size:19px;display:block">'+esc(u.nome)+'</b><span class="small">Apartamento '+u.apto+' · '+esc(u.vinculo)+'</span></span></section>';
 h+='<section class="card"><div class="row between"><h2 class="h2">Meus dados</h2><button class="btn ghost sm" style="color:var(--sea)" data-a="editPerfil">'+(S.ui.editPerfil?"Salvar":"Editar")+'</button></div>'+
 '<div><div class="xs muted">E-mail de acesso</div><b>'+esc(u.email)+'</b><div class="xs muted">Para trocar o e-mail, fale com a administração.</div></div>'+
 (S.ui.editPerfil?'<div class="fld"><label class="lbl" for="pf-tel">Telefone / WhatsApp</label><input id="pf-tel" class="in" inputmode="tel" data-bind="f.tel" value="'+esc(S.f.tel!=null?S.f.tel:u.tel)+'"></div>':'<div><div class="xs muted">Telefone / WhatsApp</div><b>'+esc(u.tel||"Não informado")+'</b></div>')+'</section>';
 h+='<section class="card"><h2 class="h2">Moradores do apto '+u.apto+'</h2><p class="small muted">Cada morador entra com o próprio e-mail e vê as mesmas reservas, encomendas e locações do apartamento.</p><div class="list">'+cad.map(function(m){return '<div class="li"><span class="av">'+esc(ini(m.nome))+'</span><span class="grow"><b>'+esc(m.nome)+(m.id===u.id?" (você)":"")+'</b><span class="xs muted" style="display:block">'+esc(m.vinculo||"")+'</span></span>'+(m.sit==="Ativo"?'<span class="pill p-ok">Com acesso</span>':sitPill(m.sit))+'</div>'}).join("")+'</div>'+
 (podeIncl(u)?'<button class="btn out" data-a="pedirIncl">Pedir inclusão de morador</button>':'<p class="small muted">Para incluir alguém, peça ao proprietário ou ao inquilino da unidade, ou fale com a administração.</p>')+'</section>';
 var mp=S.real?S.meusPedidos.map(function(x){return {nome:x.nome,vinc:x.vinculo,criado:x.criadoEm,status:x.status}}):S.solicitacoes.filter(function(x){return x.apto===u.apto&&x.origem==="morador"});
 if(mp.length)h+='<section class="card tight"><h2 class="h2">Pedidos de inclusão</h2><div class="list">'+mp.map(function(x){return '<div class="li"><span class="grow"><b>'+esc(x.nome)+'</b><span class="xs muted" style="display:block">'+esc(x.vinc)+' · pedido em '+esc(x.criado)+(x.status==="reprovada"?' · procure a administração':x.status==="aprovada"?' · já pode entrar no app':'')+'</span></span>'+solPill(x.status)+'</div>'}).join("")+'</div></section>';
 h+='<section class="card tight"><h2 class="h2">Avisos por e-mail</h2>'+[["enc","Encomendas","Quando um pacote chegar na portaria"],["res","Reservas","Confirmação, aprovação e cancelamento"],["lem","Lembrete de retirada","Se a encomenda ficar mais de "+S.cfg.lembrete+" dias"]].map(function(d){var on=d[0]==="enc"?u.avEmail!==false:av[d[0]];
  return '<button class="switchrow" data-a="avTog" data-v="'+d[0]+'" aria-pressed="'+on+'"><span><b style="display:block">'+d[1]+'</b><span class="small muted">'+d[2]+'</span></span><span class="toggle'+(on?" on":"")+'"><i></i></span></button>'}).join("")+
 '<p class="xs muted">O aviso dentro do app aparece sempre, mesmo com o e-mail desligado.</p></section>'+
 (S.cfg.waAtivo?'<section class="card tight"><h2 class="h2">Aviso por WhatsApp</h2><button class="switchrow" data-a="waOptIn" aria-pressed="'+!!u.wa+'" '+(u.tel?'':'aria-disabled="true"')+'><span><b style="display:block">Receber aviso de encomendas</b><span class="small muted">'+(u.tel?'No número '+esc(u.tel)+', enviado pela portaria ('+esc(S.cfg.waNumero)+')':'Cadastre um telefone em Meus dados para ativar')+'</span></span><span class="toggle'+(u.wa?" on":"")+'"><i></i></span></button><p class="xs muted">Ao ativar, você autoriza a portaria a enviar avisos de encomenda para este número. Dá para desligar quando quiser.</p></section>':'');
 h+='<section class="card tight"><div class="list">'+
 '<button class="li" data-a="sheet" data-v="instalar">'+ic("phone")+'<span class="grow"><b>Instalar na tela inicial</b></span>'+ic("next",18)+'</button>'+
 '<button class="li" data-a="verTermos" data-v="churras">'+ic("list")+'<span class="grow"><b>Regimento e termos de uso</b></span>'+ic("next",18)+'</button>'+
 '<button class="li" data-a="sheet" data-v="lgpd">'+ic("shield")+'<span class="grow"><b>Privacidade e meus dados</b></span>'+ic("next",18)+'</button>'+
 '<button class="li" data-a="sheet" data-v="contato">'+ic("info")+'<span class="grow"><b>Falar com a administração</b></span>'+ic("next",18)+'</button></div></section>';
 h+='<section class="card tight"><h2 class="h2">Acesso</h2><p class="small muted">Você fica conectado por '+S.cfg.sesMorador+' dias. A cada uso, o prazo recomeça.</p><button class="btn badb block" data-a="sair">'+ic("out",20)+'Sair deste aparelho</button><button class="btn ghost block" style="color:var(--bad)" data-a="sairTodos">Sair de todos os aparelhos</button><p class="xs muted">Use se perdeu o celular ou entrou num aparelho de outra pessoa.</p></section><p class="xs muted" style="text-align:center">Ed. Marapendi · versão '+esc(CFG.versao||'')+(CFG.ambiente==='TESTE'?' · TESTE':'')+'</p>';
 return h+'</main>';
}

/* ================= LOCAÇÃO / TEMPORADA ================= */
function getPath(path){var p=path.split("."),o=S;for(var i=0;i<p.length;i++){if(o==null)return null;o=o[p[i]]}return o}
function novoLf(){var u=me();return {de:"",ate:"",pessoas:[{nome:"",rg:"",cpf:"",doc:null}],veiculos:[{placa:"",modelo:"",doc:null}],semCarro:false,plataforma:"Airbnb",contato:u.nome+(u.tel?" · "+u.tel:""),obs:"",aceite:false}}
function docThumb(d,path){
 return '<button class="li" data-a="verDoc" data-v="'+path+'" style="min-height:52px;border-bottom:0;padding:4px 0">'+(d.tipo==="img"?'<img class="thumb" src="'+d.url+'" alt="">':'<span class="tile" style="width:56px;height:56px;background:var(--sunk);color:var(--muted)">'+ic("file",24)+'</span>')+'<span class="grow small" style="word-break:break-all">'+esc(d.nome)+'<span class="xs" style="display:block;color:var(--sea);font-weight:700">Ver documento</span></span></button>';
}
function docField(path,label,id){
 var d=getPath(path);
 if(d)return '<div class="fld"><span class="lbl">'+label+'</span><div class="row">'+'<div class="grow">'+docThumb(d,path)+'</div><button class="btn ghost sm" style="color:var(--bad)" data-a="rmDoc" data-v="'+path+'">Remover</button></div></div>';
 return '<div class="fld"><span class="lbl">'+label+'</span><label class="btn out sm" for="'+id+'" style="cursor:pointer">'+ic("clip",18)+'Anexar foto ou PDF</label><input id="'+id+'" type="file" accept="image/*,application/pdf" data-file="'+path+'" style="position:absolute;width:1px;height:1px;opacity:0"></div>';
}
function locDetalhe(l,adm){
 var base="L."+l.id;
 var h='<section class="card"><h2 class="h2">Período</h2><div class="g2"><div><div class="xs muted">Entrada</div><b>'+fmtD(l.de)+'</b></div><div><div class="xs muted">Saída</div><b>'+fmtD(l.ate)+'</b></div></div><div class="small muted">'+noites(l.de,l.ate)+(noites(l.de,l.ate)===1?" noite":" noites")+' · '+esc(l.plataforma)+'</div></section>';
 h+='<section class="card"><div class="row between"><h2 class="h2">Hóspedes</h2><span class="pill p-sea">'+l.pessoas.length+'</span></div>'+l.pessoas.map(function(p,i){
  return '<div class="stack" style="gap:6px;border-top:'+(i?"1px solid var(--line)":"0")+';padding-top:'+(i?"12px":"0")+'"><b>'+esc(p.nome)+'</b><div class="g2 small"><div><span class="xs muted">RG</span><br>'+esc(adm?p.rg:maskRg(p.rg))+'</div><div><span class="xs muted">CPF</span><br>'+esc(adm?fmtCpf(p.cpf):maskCpf(p.cpf))+'</div></div>'+(p.doc?docThumb(p.doc,base+".p."+i):'<span class="xs" style="color:var(--bad)">Sem documento anexado</span>')+'</div>'}).join("")+'</section>';
 h+='<section class="card"><h2 class="h2">Veículo</h2>'+(l.semCarro||!l.veiculos.length?'<p class="small muted">Os hóspedes não vão trazer carro.</p>':l.veiculos.map(function(v,i){return '<div class="stack" style="gap:6px"><div class="row">'+ic("car",22)+'<b style="letter-spacing:.06em">'+esc(v.placa.toUpperCase())+'</b><span class="small muted">'+esc(v.modelo)+'</span></div>'+(v.doc?docThumb(v.doc,base+".v."+i):'')+'</div>'}).join(""))+'</section>';
 h+='<section class="card tight"><h2 class="h2">Informações</h2><div class="small"><span class="muted">Solicitado por </span><b>'+esc(l.por)+'</b> · '+esc(l.criado)+'</div><div class="small"><span class="muted">Contato </span>'+esc(l.contato||"—")+'</div>'+(l.obs?'<div class="small"><span class="muted">Observações </span>'+esc(l.obs)+'</div>':'')+'</section>';
 h+='<section class="card tight"><h2 class="h2">Histórico</h2><div class="list">'+l.hist.map(function(x){return '<div class="li" style="min-height:40px;align-items:flex-start"><span class="xs muted" style="min-width:74px;padding-top:2px">'+esc(x.q)+'</span><span class="small grow">'+esc(x.t)+'</span></div>'}).join("")+'</div></section>';
 if(!adm)h+='<p class="xs muted">RG e CPF aparecem mascarados por segurança. Os documentos ficam visíveis só para a administração e o síndico e são apagados '+S.cfg.locDocsDias+' dias depois do fim da hospedagem.</p>';
 return h;
}
function locStatusBox(l){
 var st=locSt(l);
 if(st==="pendente")return '<div class="note" style="background:var(--warn-soft);color:var(--warn)">'+ic("info",20)+'<span><b>Aguardando análise.</b> A administração confere os dados e os documentos. Você será avisado por e-mail e aqui no app.</span></div>';
 if(st==="aprovada"||st==="andamento")return '<div class="okmsg">Autorizada de '+fmtD(l.de)+' a '+fmtD(l.ate)+(l.decisao?' por '+esc(l.decisao.por)+' em '+esc(l.decisao.q):'')+'. A portaria já tem a lista de hóspedes e o veículo.</div>';
 if(st==="encerrada")return '<div class="note">'+ic("info",20)+'<span>Hospedagem encerrada em '+fmtD(l.ate)+'.</span></div>';
 if(st==="recusada")return '<div class="errmsg"><b>Recusada'+(l.decisao?' por '+esc(l.decisao.por):'')+'.</b> Motivo: '+esc(l.motivo||"não informado")+'</div>';
 return '<div class="note" style="background:var(--off-soft);color:var(--muted2)">'+ic("ban",20)+'<span><b>Cancelada'+(l.cancelPor?' por '+esc(l.cancelPor):'')+'.</b>'+(l.motivo?' Motivo: '+esc(l.motivo):'')+'</span></div>';
}
function locCard(l,adm){
 return '<button class="card" style="text-align:left" data-a="abrirLoc" data-v="'+l.id+'"><div class="row between wrapr">'+(adm?'<b style="font-size:18px;color:var(--sea-strong)">Apto '+l.apto+'</b>':'<b style="font-size:16px">'+esc(periodo(l))+'</b>')+locPill(l)+'</div>'+
 (adm?'<div class="small"><b>'+esc(periodo(l))+'</b></div>':'')+
 '<div class="small muted">'+l.pessoas.length+(l.pessoas.length>1?" hóspedes":" hóspede")+': '+esc(l.pessoas.map(function(p){return p.nome.split(" ")[0]}).join(", "))+(l.semCarro||!l.veiculos.length?" · sem carro":" · carro "+esc(l.veiculos[0].placa.toUpperCase()))+'</div>'+
 '<div class="xs muted">Pedido por '+esc(l.por)+' · '+esc(l.criado)+'</div></button>';
}
function mLoc(){
 var u=me(),l=S.locacoes.filter(function(x){return x.apto===u.apto}).sort(function(a,b){return b.id-a.id});
 var h=topbar("Locação / temporada","Apartamento "+u.apto)+'<main class="wrap page">'+
 '<div class="note">'+ic("info",20)+'<span>Vai receber hóspedes que não moram no prédio (Airbnb, temporada ou empréstimo do apartamento)? Peça a autorização com pelo menos '+S.cfg.locAntMin+' dias de antecedência. A portaria só libera a entrada de quem estiver autorizado.</span></div>'+
 '<button class="btn block" data-a="locNovaBtn">'+ic("key",20)+'Nova solicitação</button>';
 if(S.ui.okLoc)h+='<div class="okmsg" role="status">'+esc(S.ui.okLoc)+'</div>';
 h+='<section class="stack g12"><h2 class="h2">Solicitações do apartamento</h2>'+(l.length?l.map(function(x){return locCard(x,false)}).join(""):empty("Nenhuma solicitação ainda."))+'</section>';
 return h+'</main>';
}
function mLocNova(){
 if(!podeLoc(me()))return topbar("Nova solicitação","Locação / temporada · apto "+me().apto,{back:"locListaBtn"})+'<main class="wrap page"><div class="note">'+ic("info",20)+'<span>Neste condomínio, só o proprietário da unidade pode pedir autorização de locação ou temporada. Fale com o proprietário do apto '+me().apto+' ou com a administração.</span></div></main>';
 var F=S.lf||(S.lf=novoLf()),min=addDays(TODAY,S.cfg.locAntMin);
 var h=topbar("Nova solicitação","Locação / temporada · apto "+me().apto,{back:"locListaBtn"})+'<main class="wrap page">';
 h+='<section class="card"><h2 class="h2">1. Período da autorização</h2><div class="g2"><div class="fld"><label class="lbl" for="lf-de">Entrada</label><input id="lf-de" class="in" type="date" min="'+min+'" data-bind="lf.de" data-rerender="1" value="'+esc(F.de)+'"></div><div class="fld"><label class="lbl" for="lf-ate">Saída</label><input id="lf-ate" class="in" type="date" min="'+(F.de||min)+'" data-bind="lf.ate" data-rerender="1" value="'+esc(F.ate)+'"></div></div>'+
 (F.de&&F.ate&&F.ate>F.de?'<span class="pill p-sea">'+noites(F.de,F.ate)+(noites(F.de,F.ate)===1?" noite":" noites")+'</span>':'<span class="hint">A entrada precisa ser a partir de '+fmtD(min)+'.</span>')+'</section>';
 h+='<section class="card"><div class="row between"><h2 class="h2">2. Hóspedes</h2><span class="pill p-sea">'+F.pessoas.length+'</span></div><p class="small muted">Todas as pessoas que vão ficar no apartamento, inclusive crianças. Anexe uma foto do documento de cada uma (RG ou CNH, frente e verso numa foto só).</p>';
 F.pessoas.forEach(function(p,i){var b="lf.pessoas."+i,id="lf-p"+i;
  h+='<div class="card tight" style="background:var(--bg)"><div class="row between"><b>Pessoa '+(i+1)+'</b>'+(F.pessoas.length>1?'<button class="btn ghost sm" style="color:var(--bad)" data-a="lfRemP" data-v="'+i+'">Remover</button>':'')+'</div>'+
  '<div class="fld"><label class="lbl" for="'+id+'-nome">Nome completo</label><input id="'+id+'-nome" class="in" autocomplete="off" data-bind="'+b+'.nome" value="'+esc(p.nome)+'"></div>'+
  '<div class="g2"><div class="fld"><label class="lbl" for="'+id+'-rg">RG</label><input id="'+id+'-rg" class="in" autocomplete="off" data-bind="'+b+'.rg" value="'+esc(p.rg)+'"></div><div class="fld"><label class="lbl" for="'+id+'-cpf">CPF</label><input id="'+id+'-cpf" class="in" inputmode="numeric" autocomplete="off" data-bind="'+b+'.cpf" value="'+esc(p.cpf)+'" placeholder="000.000.000-00"></div></div>'+
  docField(b+".doc","Documento com foto",id+"-doc")+'</div>';
 });
 h+='<button class="btn out sm" data-a="lfAddP">+ Adicionar pessoa</button><p class="hint">Para testar, use um CPF válido, por exemplo 529.982.247-25.</p></section>';
 h+='<section class="card"><h2 class="h2">3. Veículo</h2><button class="switchrow" data-a="lfSemCarro" aria-pressed="'+F.semCarro+'" style="border:0"><span><b style="display:block">Os hóspedes não vão trazer carro</b><span class="small muted">Desligue para informar placa e documento</span></span><span class="toggle'+(F.semCarro?" on":"")+'"><i></i></span></button>';
 if(!F.semCarro){F.veiculos.forEach(function(v,i){var b="lf.veiculos."+i,id="lf-v"+i;
  h+='<div class="card tight" style="background:var(--bg)"><div class="row between"><b>Veículo '+(i+1)+'</b>'+(F.veiculos.length>1?'<button class="btn ghost sm" style="color:var(--bad)" data-a="lfRemV" data-v="'+i+'">Remover</button>':'')+'</div>'+
  '<div class="g2"><div class="fld"><label class="lbl" for="'+id+'-placa">Placa</label><input id="'+id+'-placa" class="in" autocomplete="off" style="text-transform:uppercase" data-bind="'+b+'.placa" value="'+esc(v.placa)+'" placeholder="ABC1D23"></div><div class="fld"><label class="lbl" for="'+id+'-mod">Modelo e cor</label><input id="'+id+'-mod" class="in" data-bind="'+b+'.modelo" value="'+esc(v.modelo)+'" placeholder="Onix prata"></div></div>'+
  docField(b+".doc","Documento do carro (CRLV)",id+"-doc")+'</div>'});
  h+='<button class="btn out sm" data-a="lfAddV">+ Adicionar veículo</button>';}
 h+='</section>';
 h+='<section class="card"><h2 class="h2">4. Informações adicionais</h2>'+
 '<div class="fld"><label class="lbl" for="lf-plat">Tipo de hospedagem</label><select id="lf-plat" class="in" data-bind="lf.plataforma">'+["Airbnb","Booking","Temporada direta com o proprietário","Empréstimo para parentes ou amigos","Outra"].map(function(o){return '<option'+(F.plataforma===o?" selected":"")+'>'+o+'</option>'}).join("")+'</select></div>'+
 '<div class="fld"><label class="lbl" for="lf-cont">Contato do responsável</label><input id="lf-cont" class="in" data-bind="lf.contato" value="'+esc(F.contato)+'"></div>'+
 '<div class="fld"><label class="lbl" for="lf-obs">Observações (opcional)</label><textarea id="lf-obs" class="in" data-bind="lf.obs" placeholder="Ex.: horário previsto de chegada">'+esc(F.obs)+'</textarea></div></section>';
 h+='<label class="row" style="align-items:flex-start"><input type="checkbox" id="lf-aceite" data-a="lfAceite" '+(F.aceite?"checked":"")+' style="width:24px;height:24px;margin:0;flex-shrink:0;accent-color:var(--sea)"><span class="small">Declaro que as informações são verdadeiras e que os hóspedes vão seguir o regimento interno. Sou responsável pelos hóspedes durante a estadia.</span></label>';
 h+='<p class="xs muted">Os documentos ficam visíveis só para a administração e o síndico e são apagados '+S.cfg.locDocsDias+' dias depois do fim da hospedagem.</p>';
 h+=(S.ui.errForm?'<div class="errmsg" role="alert">'+esc(S.ui.errForm)+'</div>':'')+'<button class="btn block" data-a="locEnviar">Enviar para análise</button><button class="btn ghost block" data-a="locListaBtn">Cancelar</button>';
 return h+'</main>';
}
function mLocDet(){
 var u=me(),l=loc(S.ui.locId);if(!l||l.apto!==u.apto){S.screen="loc";return mLoc()}
 var st=locSt(l);
 var h=topbar("Locação / temporada",periodo(l),{back:"locListaBtn"})+'<main class="wrap page"><div class="row between"><b>Situação</b>'+locPill(l)+'</div>'+locStatusBox(l);
 if(st==="recusada")h+='<button class="btn block" data-a="locCorrigir" data-v="'+l.id+'">Corrigir e enviar de novo</button>';
 h+=locDetalhe(l,false);
 if(st==="pendente")h+='<button class="btn badb block" data-a="locMotivoM" data-v="'+l.id+'">Cancelar solicitação</button>';
 if(st==="aprovada"||st==="andamento")h+='<button class="btn badb block" data-a="locMotivoM" data-v="'+l.id+'">Cancelar autorização</button>';
 return h+'</main>';
}
/* ---- síndico ---- */
function sLocacoes(){
 if(S.ui.locId&&loc(S.ui.locId))return sLocAdm();
 var fil=S.ui.filLoc||"pendente",cnt=function(f){return S.locacoes.filter(function(l){return filtroLoc(l,f)}).length};
 var l=S.locacoes.filter(function(x){return filtroLoc(x,fil)}).sort(function(a,b){return a.de<b.de?-1:1});
 var h='<main class="wrap page"><p class="small muted">Pedidos dos moradores para receber hóspedes. Confira os dados e os documentos antes de aprovar.</p>';
 if(S.ui.okLocAdm)h+='<div class="okmsg" role="status">'+esc(S.ui.okLocAdm)+'</div>';
 h+='<div class="chips">'+[["pendente","Aguardando"],["aprovada","Aprovadas"],["recusada","Recusadas"],["cancelada","Canceladas"],["todas","Todas"]].map(function(x){return '<button class="chip'+(fil===x[0]?" on":"")+'" data-a="filLoc" data-v="'+x[0]+'">'+x[1]+' ('+cnt(x[0])+')</button>'}).join("")+'</div>';
 h+=l.length?l.map(function(x){return locCard(x,true)}).join(""):empty("Nenhuma solicitação neste filtro.");
 return h+'</main>';
}
function filtroLoc(l,f){var st=locSt(l);if(f==="todas")return true;if(f==="aprovada")return st==="aprovada"||st==="andamento"||st==="encerrada";return st===f}
function sLocAdm(){
 var l=loc(S.ui.locId),st=locSt(l);
 var h='<main class="wrap page"><button class="btn ghost sm" style="align-self:flex-start;color:var(--sea);padding-left:0" data-a="locVoltar">'+ic("back",18)+'Todas as solicitações</button>'+
 '<section class="card"><div class="row between wrapr"><b style="font-size:20px;color:var(--sea-strong)">Apto '+l.apto+'</b>'+locPill(l)+'</div><div class="small">'+esc(periodo(l))+'</div><div class="xs muted">Pedido por '+esc(l.por)+' em '+esc(l.criado)+'</div></section>';
 if(st==="pendente")h+='<div class="note">'+ic("shield",20)+'<span><b>Antes de aprovar, confira:</b> nomes iguais aos documentos, documentos legíveis, CPF de cada pessoa, placa igual ao CRLV e período de acordo com o regimento.</span></div>';
 else h+=locStatusBox(l);
 h+=locDetalhe(l,true);
 if(st==="pendente")h+='<div class="g2"><button class="btn okb" data-a="locAprovar" data-v="'+l.id+'">Aprovar</button><button class="btn badb" data-a="locRecusar" data-v="'+l.id+'">Recusar</button></div>';
 if(st==="aprovada"||st==="andamento")h+='<button class="btn badb block" data-a="locCancelarA" data-v="'+l.id+'">Cancelar autorização</button>';
 return h+'</main>';
}
/* ---- portaria ---- */
function pQuem(sc){
 var h='<main class="wrap page"><div class="stack"><h2 style="font-size:24px;font-weight:800">Quem está usando agora?</h2><p class="muted">Toque no seu nome para '+(sc==="enc"?"registrar encomendas":"registrar retiradas")+'. Tudo o que você fizer fica registrado no seu nome.'+(S.cfg.exigirPin?' Depois, digite o seu PIN de 4 dígitos.':'')+'</p></div><div class="stack">';
 porteirosAtivos().forEach(function(p){h+='<button class="rolebtn" style="min-height:68px;font-size:17px" data-a="escolhePorteiro" data-v="'+p.id+'"><span class="av" style="width:46px;height:46px;border-radius:23px">'+esc(ini(p.nome))+'</span><span class="grow">'+esc(p.nome)+'<br><span class="small muted" style="font-weight:500">'+esc(p.turno||"")+'</span></span>'+ic("next")+'</button>'});
 h+='</div><p class="xs muted">Depois de '+S.cfg.portRelogin+' minutos sem uso, o app pergunta de novo. Não encontrou seu nome? Peça à administração para cadastrar você.</p></main>';
 return h;
}
function pAgenda(){
 var lim=addDays(TODAY,7);
 var locs=S.locacoes.filter(function(l){return l.status==="aprovada"&&l.ate>=TODAY&&l.de<=lim}).sort(function(a,b){return a.de<b.de?-1:1});
 var h='<main class="wrap page"><h2 style="font-size:22px;font-weight:800">Agenda da portaria</h2>';
 h+='<section class="stack g12"><div class="section-title">Hóspedes autorizados · locação / temporada</div>';
 if(!locs.length)h+=empty("Nenhuma hospedagem autorizada nos próximos 7 dias.");
 locs.forEach(function(l){
  h+='<section class="card"><div class="row between wrapr"><b style="font-size:18px;color:var(--sea-strong)">Apto '+l.apto+'</b>'+locPill(l)+'</div><div class="small"><b>'+esc(periodo(l))+'</b> · autorizado pela administração</div>'+
  '<div class="list">'+l.pessoas.map(function(p){return '<div class="li" style="min-height:44px"><span class="av" style="width:32px;height:32px;font-size:12px">'+esc(ini(p.nome))+'</span><span class="grow">'+esc(p.nome)+'<span class="xs muted" style="display:block">RG '+esc(maskRg(p.rg))+'</span></span></div>'}).join("")+'</div>'+
  (l.semCarro||!l.veiculos.length?'<div class="small muted">Sem carro</div>':l.veiculos.map(function(v){return '<div class="row small">'+ic("car",20)+'<b style="letter-spacing:.06em">'+esc(v.placa.toUpperCase())+'</b><span class="muted">'+esc(v.modelo)+'</span></div>'}).join(""))+'</section>';
 });
 h+='</section>';
 var l2=S.reservas.filter(function(r){return r.data>=TODAY&&r.data<=lim&&r.status==="confirmada"}).sort(function(a,b){return a.data<b.data?-1:1});
 h+='<section class="stack g12"><div class="section-title">Reservas das áreas comuns · próximos 7 dias</div>';
 if(!l2.length)h+=empty("Nenhuma reserva confirmada nos próximos 7 dias.");
 l2.forEach(function(r){var a=area(r.area),open=String(S.ui.openRes)===String(r.id);if(!a)return;
  h+='<section class="card"><div class="row">'+dateBox(r.data)+'<div class="grow"><b style="font-size:16px">'+esc(a.nome)+(r.data===TODAY?' <span class="pill" style="background:var(--sun);color:var(--on-sun)">Hoje</span>':'')+'</b><div class="small muted">Apto '+r.apto+' · '+esc(r.nome)+'</div><div class="xs muted">'+esc(turnoLabel(a,r.turno))+'</div></div></div>'+
  '<button class="btn out sm" data-a="pOpenRes" data-v="'+r.id+'">'+(open?"Ocultar":"Ver")+' lista de convidados ('+r.convidados.length+')</button>'+
  (open?(r.convidados.length?'<div class="list">'+r.convidados.map(function(c){return '<div class="li" style="min-height:44px"><span class="av" style="width:32px;height:32px;font-size:12px">'+esc(ini(c.n))+'</span><span class="grow">'+esc(c.n)+(c.d?'<span class="xs muted" style="display:block">Doc. '+esc(c.d)+'</span>':'')+'</span></div>'}).join("")+'</div>':'<p class="small muted">O morador ainda não cadastrou convidados.</p>'):'')+'</section>';
 });
 return h+'</section></main>';
}

/* ================= PORTARIA ================= */
function vPortaria(){
 var sc=S.screen||"enc",body;
 if(S.porteiro&&S.portLast&&Date.now()-S.portLast>S.cfg.portRelogin*60000)S.porteiro=null;
 var p=S.porteiro?user(S.porteiro):null;
 var hb='background:transparent;color:var(--on-palm);border:1.5px solid var(--palm-soft)';
 var head='<header class="top palm wrap"><div class="grow"><div class="xs" style="color:var(--palm-soft);font-weight:700;letter-spacing:.05em">PORTARIA · ED. MARAPENDI</div><h1 style="font-size:18px">'+(p?esc(p.nome):"Acesso da portaria")+'</h1>'+(p?'<div class="sub">'+esc(p.turno||"")+'</div>':'')+'</div>'+(p?'<button class="btn sm" style="'+hb+'" data-a="trocaPorteiro" aria-label="Trocar porteiro" title="Trocar porteiro">'+ic("swap",18)+'Trocar</button>':'')+'<button class="btn sm" style="'+hb+'" data-a="sair">Sair</button></header>';
 if((sc==="enc"||sc==="fila")&&!p)body=pQuem(sc);
 else if(sc==="enc")body=pRegistrar();else if(sc==="fila")body=pFila();else body=pAgenda();
 var pend=S.encomendas.filter(function(e){return e.status==="pendente"}).length;
 return head+body+nav([{v:"enc",i:"calplus",l:"Registrar",on:sc==="enc"},{v:"fila",i:"box",l:"Retiradas",on:sc==="fila",badge:pend},{v:"pres",i:"cal",l:"Agenda",on:sc==="pres"}]);
}
function novoItem(){return {tipo:"Caixa média",rem:"",foto:null}}
function pRegistrar(){
 var f=S.f;if(f.un==null){f.andar=12;f.un="1203";f.itens=[novoItem()]}
 var h='<main class="wrap page"><h2 style="font-size:22px;font-weight:800">Registrar encomendas</h2>';
 h+='<section class="stack"><div class="lbl">Andar</div><div class="grid6">';for(var i=1;i<=S.cfg.andares;i++)h+='<button class="numbtn'+(f.andar===i?" on":"")+'" data-a="pAndar" data-v="'+i+'" aria-label="'+i+'º andar">'+i+'</button>';h+='</div></section>';
 var lado=function(L){var ini=L==="A"?1:S.cfg.porLado+1,o='<div class="stack" style="gap:6px;min-width:0"><div class="xs muted" style="font-weight:800;letter-spacing:.05em">LADO '+L+' · '+faixaLado(L)+'</div><div class="grid3">';for(var k=ini;k<ini+S.cfg.porLado;k++){var n=String(f.andar*100+k);o+='<button class="numbtn'+(f.un===n?" on":"")+'" data-a="pApto" data-v="'+n+'" style="height:46px">'+n+'</button>'}return o+'</div></div>'};
 h+='<section class="stack"><div class="lbl">Apartamento</div>'+(f.andar?'<div class="g2" style="gap:14px">'+lado("A")+lado("B")+'</div>':'<p class="hint">Escolha um andar acima ou uma unidade fora do padrão abaixo.</p>');
 var ex=S.extras.filter(function(e){return e.ativo&&e.encomendas});
 if(ex.length)h+='<div class="xs muted" style="font-weight:800;letter-spacing:.05em;margin-top:4px">UNIDADES FORA DO PADRÃO</div><div class="chips">'+ex.map(function(e){return '<button class="chip'+(f.un===e.num?" on":"")+'" data-a="pExtra" data-v="'+e.num+'">'+esc(e.nome)+' · '+esc(e.num)+'</button>'}).join("")+'</div>';
 var un=f.un,mor=moradoresDe(un);
 h+='<p class="hint">'+(mor.length?"Moradores: "+mor.map(function(m){return esc(m.nome)}).join(", "):"Unidade sem morador cadastrado: o aviso fica só na lista da portaria.")+'</p></section>';
 h+='<section class="stack g12"><div class="row between"><span class="lbl">Encomendas para '+esc(unLabel(un))+'</span><span class="pill p-sea">'+f.itens.length+'</span></div>';
 f.itens.forEach(function(it,i){var id="p-it"+i;
  h+='<div class="card tight" style="background:var(--bg)"><div class="row between"><b>Encomenda '+(i+1)+'</b>'+(f.itens.length>1?'<button class="btn ghost sm" style="color:var(--bad)" data-a="pRemItem" data-v="'+i+'">Remover</button>':'')+'</div>'+
  '<div class="chips">'+TIPOS.map(function(t){return '<button class="chip'+(it.tipo===t?" on":"")+'" data-a="pTipo" data-v="'+i+'|'+t+'">'+t+'</button>'}).join("")+'</div>'+
  '<div class="fld"><label class="lbl" for="'+id+'-rem">Remetente (opcional)</label><input id="'+id+'-rem" class="in" data-bind="f.itens.'+i+'.rem" value="'+esc(it.rem)+'" placeholder="Ex.: Mercado Livre, Correios"></div>'+
  (it.foto?'<div class="row"><img class="thumb" src="'+it.foto+'" alt="Foto da encomenda '+(i+1)+'"><span class="grow small">Foto anexada</span><button class="btn ghost sm" data-a="pTiraFoto" data-v="'+i+'">Remover foto</button></div>':'<label class="btn out sm" for="'+id+'-foto" style="cursor:pointer;align-self:flex-start">'+ic("cam",18)+'Foto (opcional)</label><input id="'+id+'-foto" type="file" accept="image/*" capture="environment" data-foto="'+i+'" style="position:absolute;width:1px;height:1px;opacity:0">')+'</div>'});
 h+='<button class="btn out" data-a="pAddItem">+ Adicionar outra encomenda</button></section>';
 var n=f.itens.length;
 h+='<button class="btn block" data-a="pRegistrar">'+(n>1?"Registrar "+n+" encomendas":"Registrar encomenda")+'</button><p class="xs muted" style="margin-top:-6px">O morador recebe um único aviso com todas. Se chegar outra depois de registrar, faça um novo registro.</p>';
 if(S.ui.okReg){var le=encPorId(S.ui.lastEnc),wd=le?waDest(le.apto):[];
  h+='<div class="okmsg stack" role="status"><span>'+esc(S.ui.okReg)+'</span>'+(le&&S.cfg.waAtivo?(le.waEm?'<span class="small">'+ic("check",16)+' WhatsApp enviado '+esc(le.waEm)+'</span>':wd.length?'<button class="btn wa" data-a="waAbrir" data-v="'+le.id+'">'+ic("wa",20)+'Avisar no WhatsApp</button>':'<span class="small" style="font-weight:500">Ninguém do apto '+le.apto+' autorizou aviso por WhatsApp.</span>'):'')+'</div>'}
 return h+'</main>';
}
function pFila(){
 var q=(S.ui.busca||"").trim(),pend=S.encomendas.filter(function(e){return e.status==="pendente"&&(!q||e.apto.indexOf(q)===0)}).sort(function(a,b){return (a.data+a.hora)<(b.data+b.hora)?1:-1});
 var hoje=S.encomendas.filter(function(e){return e.status==="retirada"&&/^Hoje/.test(e.em)});
 var h='<main class="wrap page"><div class="row between"><h2 style="font-size:22px;font-weight:800">Aguardando retirada</h2><span class="pill p-sea">'+S.encomendas.filter(function(e){return e.status==="pendente"}).length+' pacotes</span></div>'+
 '<div class="fld"><label class="lbl" for="p-busca">Buscar por apartamento</label><input id="p-busca" class="in" inputmode="numeric" data-bind="ui.busca" data-live="1" value="'+esc(q)+'" placeholder="Ex.: 1203"></div>';
 if(S.ui.okRet)h+='<div class="okmsg" role="status">'+esc(S.ui.okRet)+'</div>';
 if(!pend.length)h+=empty(q?"Nenhuma encomenda para o apto "+q+".":"Nenhuma encomenda aguardando retirada.");
 pend.forEach(function(e){var dias=Math.round((s2d(TODAY)-s2d(e.data))/86400000);
  h+='<div class="card" style="flex-direction:row;align-items:center;padding:12px 14px">'+(e.foto?'<img class="thumb" src="'+e.foto+'" alt="">':'')+'<div style="font-size:20px;font-weight:800;color:var(--sea-strong);min-width:56px;font-variant-numeric:tabular-nums">'+e.apto+'</div><div class="grow"><b class="small">'+esc(e.tipo)+(e.rem?" · "+esc(e.rem):"")+'</b><div class="xs muted">'+esc(quando(e.data,e.hora))+' · cód. '+e.cod+(dias>=S.cfg.lembrete?' · <span style="color:var(--bad);font-weight:700">'+dias+' dias</span>':'')+'</div>'+(e.waEm?'<div class="xs" style="color:#178A45;font-weight:700">WhatsApp enviado '+esc(e.waEm)+'</div>':'')+'</div><div class="stack" style="gap:6px">'+(S.cfg.waAtivo&&waDest(e.apto).length?'<button class="btn waout sm" data-a="waAbrir" data-v="'+e.id+'" aria-label="Avisar apto '+e.apto+' no WhatsApp">'+ic("wa",18)+(e.waEm?'Reenviar':'Avisar')+'</button>':'')+'<button class="btn sunb sm" data-a="pRetirada" data-v="'+e.id+'">Retirada</button></div></div>';
 });
 if(hoje.length){h+='<section class="stack"><div class="section-title">Retiradas de hoje</div><div class="card tight"><div class="list">'+hoje.map(function(e){return '<div class="li"><b style="min-width:52px;color:var(--sea-strong)">'+e.apto+'</b><span class="grow small">'+esc(e.tipo)+'<span class="xs muted" style="display:block">'+esc(e.em)+' · '+esc(e.por)+'</span></span></div>'}).join("")+'</div></div></section>'}
 return h+'</main>';
}
/* ================= SÍNDICO ================= */
var SMENU=[["painel","Painel","grid"],["reservas","Reservas","cal"],["locacoes","Locação / temporada","key"],["usuarios","Unidades e usuários","users"],["encomendas","Encomendas","box"],["areas","Áreas comuns","home"],["bloqueios","Bloqueios de agenda","ban"],["relatorios","Relatórios","chart"],["auditoria","Auditoria","list"],["config","Configurações","gear"]];
function vSindico(){
 var sc=S.screen||"painel",t=SMENU.filter(function(m){return m[0]===sc})[0],body;
 var head=topbar(t[1],sc==="painel"?fmtLong(TODAY):"Ed. Marapendi · "+(me().perfil==="sindico"?"Síndico":"Administração"),{palm:true,right:sc==="painel"?'<button class="btn sm" style="background:transparent;color:var(--on-palm);border:1.5px solid var(--palm-soft)" data-a="sair">Sair</button>':""});
 body={painel:sPainel,reservas:sReservas,locacoes:sLocacoes,usuarios:sUsuarios,encomendas:sEncomendas,areas:sAreas,bloqueios:sBloqueios,relatorios:sRelatorios,auditoria:sAuditoria,config:sConfig}[sc]();
 var maisOn=["encomendas","areas","bloqueios","relatorios","auditoria","config"].indexOf(sc)>=0;
 var ag=S.reservas.filter(function(r){return r.status==="aguardando"}).length,lp=S.locacoes.filter(function(l){return l.status==="pendente"}).length;
 var sp=solPendentes(),badges={reservas:ag||"",locacoes:lp||"",usuarios:sp||""};
 if(WIDE())return head+body+nav(SMENU.map(function(m){return {v:m[0],i:m[2],l:m[1],on:sc===m[0],badge:badges[m[0]]||""}}).concat([{v:"_sair",i:"out",l:"Sair",on:false}]));
 return head+body+nav([{v:"painel",i:"grid",l:"Painel",on:sc==="painel"},{v:"reservas",i:"cal",l:"Reservas",on:sc==="reservas",badge:ag||""},{v:"locacoes",i:"key",l:"Locação",on:sc==="locacoes",badge:lp||""},{v:"usuarios",i:"users",l:"Usuários",on:sc==="usuarios",badge:sp||""},{v:"_mais",i:"more",l:"Mais",on:maisOn}]);
}
function cardReservaAdm(r,acoes){var a=area(r.area);if(!a)return "";
 return '<section class="card"><div class="row">'+dateBox(r.data)+'<div class="grow"><b style="font-size:16px">'+esc(a.nome)+'</b><div class="small">Apto <b>'+r.apto+'</b> · '+esc(r.nome)+'</div><div class="xs muted">'+esc(turnoLabel(a,r.turno))+' · '+(r.isenta?"Isenta":brl(r.taxa!=null?r.taxa:a.preco))+' · '+r.convidados.length+' convidados</div>'+(r.motivo&&(r.status==="recusada"||r.status==="cancelada")?'<div class="xs muted">Motivo: '+esc(r.motivo)+'</div>':'')+(r.origem?'<div class="xs" style="color:var(--sea-strong);font-weight:700">'+esc(r.origem)+'</div>':'')+'</div></div><div class="row between wrapr">'+statusPill(r.status)+(acoes?'<div class="row" style="gap:8px">'+
 (r.status==="aguardando"?'<button class="btn okb sm" data-a="sAprovar" data-v="'+r.id+'">Aprovar</button><button class="btn badb sm" data-a="sRecusar" data-v="'+r.id+'">Recusar</button>':'')+
 (r.status==="confirmada"&&r.data>=TODAY?'<button class="btn badb sm" data-a="sCancelar" data-v="'+r.id+'">Cancelar</button>':'')+'</div>':'')+'</div></section>';
}
function sPainel(){
 var ag=S.reservas.filter(function(r){return r.status==="aguardando"}),pend=S.encomendas.filter(function(e){return e.status==="pendente"}),fal=pend.filter(function(e){return e.aviso!=="email"});
 var prox=S.reservas.filter(function(r){return r.data>=TODAY&&r.data<=addDays(TODAY,30)&&ativa(r)}).length;
 var velhas=pend.filter(function(e){return (s2d(TODAY)-s2d(e.data))/86400000>=S.cfg.lembrete}).length;
 var h='<main class="wrap page">'+(S.real&&CFG.modoExemplo?'<div class="note">'+ic("info",20)+'<span>Ambiente de TESTE. Já usam o servidor de verdade: entrada, pedidos de cadastro, usuários, unidades, configurações, encomendas, portaria, reservas, espaços e bloqueios. Locação, relatórios e auditoria ainda mostram dados de exemplo.</span></div>':'')+'<div class="kpis">'+
 '<button class="kpi" data-a="go" data-v="reservas"><span class="k">Reservas nos próximos 30 dias</span><b>'+prox+'</b><span class="xs muted">Churrasqueira e salão</span></button>'+
 '<button class="kpi" data-a="go" data-v="reservas"><span class="k">Aguardando aprovação</span><b style="color:var(--warn)">'+ag.length+'</b><span class="xs muted">Espaços com aprovação manual</span></button>'+
 '<button class="kpi" data-a="go" data-v="encomendas"><span class="k">Encomendas na portaria</span><b>'+pend.length+'</b><span class="xs muted">'+velhas+' há '+S.cfg.lembrete+' dias ou mais</span></button>'+
 '<button class="kpi" data-a="go" data-v="encomendas"><span class="k">E-mails com falha</span><b style="color:var(--bad)">'+fal.length+'</b><span class="xs muted">Morador avisado no app</span></button>'+
 '<button class="kpi" data-a="go" data-v="locacoes"><span class="k">Locações aguardando análise</span><b style="color:var(--warn)">'+S.locacoes.filter(function(l){return l.status==="pendente"}).length+'</b><span class="xs muted">Pedidos de temporada</span></button>'+
 '<button class="kpi" data-a="go" data-v="locacoes"><span class="k">Hospedagens em andamento</span><b>'+S.locacoes.filter(function(l){return locSt(l)==="andamento"}).length+'</b><span class="xs muted">Hóspedes no prédio hoje</span></button>'+
 '<button class="kpi" data-a="goSol"><span class="k">Pedidos de cadastro</span><b style="color:var(--warn)">'+solPendentes()+'</b><span class="xs muted">Pessoas aguardando aprovação</span></button></div>';
 duplicidades().forEach(function(par){var a=area(par[0].area);if(!a)return;
  h+='<section class="card" style="border:2px solid var(--bad)"><div class="row between wrapr"><h2 class="h2" style="color:var(--bad)">Possível duplicidade</h2><span class="pill p-bad">'+esc(a.nome)+' · '+fmtD(par[0].data)+'</span></div><p class="small">Duas reservas ativas para o mesmo espaço e data. Normalmente acontece quando a planilha é editada à mão. Vale a que entrou primeiro: cancele a outra e o morador é avisado.</p>'+
  '<div class="list">'+par.map(function(r,i){return '<div class="li" style="align-items:flex-start"><span class="grow"><b>Apto '+r.apto+' · '+esc(r.nome)+'</b><span class="xs muted" style="display:block">Registrada em '+esc(fmtCriado(r.criado))+'</span>'+(i===0?'<span class="pill p-ok" style="margin-top:4px">Entrou primeiro</span>':'<span class="pill p-warn" style="margin-top:4px">Entrou depois</span>')+'</span><button class="btn badb sm" data-a="sCancelar" data-v="'+r.id+'">Cancelar esta</button></div>'}).join("")+'</div></section>';
 });
 var lpend=S.locacoes.filter(function(l){return l.status==="pendente"});
 h+='<section class="stack g12"><h2 class="h2">Locações aguardando análise</h2>'+(lpend.length?lpend.map(function(l){return locCard(l,true)}).join(""):empty("Nenhuma solicitação de locação pendente."))+'</section>';
 h+='<div class="g2"><button class="btn" data-a="sNovaRes">'+ic("calplus",20)+'Incluir reserva</button><button class="btn out" data-a="sVerCal">'+ic("cal",20)+'Ver calendário</button></div>';
 h+='<section class="stack g12"><h2 class="h2">Aguardando aprovação</h2>'+(ag.length?ag.map(function(r){return cardReservaAdm(r,true)}).join(""):empty("Nenhuma reserva aguardando aprovação."))+'</section>';
 h+='<section class="card"><div class="row between"><h2 class="h2">Avisos com falha</h2>'+(fal.length?'<button class="btn out sm" data-a="sReenviar">Reenviar</button>':'')+'</div>'+(fal.length?'<div class="list">'+fal.map(function(e){return '<div class="li"><b style="min-width:52px">'+e.apto+'</b><span class="grow small">'+esc(e.tipo)+' · '+esc(quando(e.data,e.hora))+'<span style="display:block;color:var(--bad);font-weight:600" class="xs">'+(e.aviso==="cota"?"Cota diária de e-mails atingida · nova tentativa às 07:00":"E-mail inválido · revisar cadastro")+'</span></span></div>'}).join("")+'</div>':'<p class="small muted">Nenhuma falha de envio.</p>')+'</section>';
 return h+'</main>';
}
function formNovaRes(){
 if(!area(S.f.area))return empty("Cadastre um espaço em Mais › Áreas comuns.");
 var f=S.f,a=area(f.area),turno=a.modo==="integral"?"integral":f.turno,valido=aptoValido(f.apto),mor=valido?moradoresDe(f.apto):[];
 var c=!valido?{msg:"Unidade inexistente. Use andar (1 a "+S.cfg.andares+") + número (Lado A "+faixaLado("A")+", Lado B "+faixaLado("B")+"), ex.: 807, ou a identificação de uma unidade fora do padrão (ex.: COB)."}:(unExtra(f.apto)&&!unExtra(f.apto).reservas)?{msg:unExtra(f.apto).nome+" não pode reservar áreas comuns (ajuste em Usuários › Unidades)."}:!f.data?{msg:"Informe a data."}:!turno?{msg:"Escolha o turno."}:conflito(a.id,f.data,turno);
 var h='<section class="card" style="border:2px solid var(--sea)"><div class="row between"><h2 class="h2">Incluir reserva</h2><button class="iconbtn ghost" data-a="sFechaForm" aria-label="Fechar">'+ic("x")+'</button></div>'+
 '<p class="small muted">Para pedidos feitos por telefone, e-mail ou na administração.</p>'+
 '<div class="g2"><div class="fld"><label class="lbl" for="nr-apto">Apartamento</label><input id="nr-apto" class="in" data-bind="f.apto" data-live="1" value="'+esc(f.apto)+'" placeholder="Ex.: 807 ou COB"></div>'+
 '<div class="fld"><label class="lbl" for="nr-orig">Pedido por</label><select id="nr-orig" class="in" data-bind="f.orig"><option'+(f.orig==="Telefone"?" selected":"")+'>Telefone</option><option'+(f.orig==="Presencialmente"?" selected":"")+'>Presencialmente</option><option'+(f.orig==="E-mail"?" selected":"")+'>E-mail</option><option'+(f.orig==="WhatsApp"?" selected":"")+'>WhatsApp</option></select></div></div>'+
 '<div class="fld"><label class="lbl" for="nr-mor">Morador responsável</label><select id="nr-mor" class="in" data-bind="f.mor">'+(mor.length?mor.map(function(m){return '<option'+(f.mor===m.nome?" selected":"")+'>'+esc(m.nome)+'</option>'}).join(""):'<option>Sem morador cadastrado</option>')+'</select></div>'+
 '<div class="fld"><span class="lbl">Espaço</span><div class="chips">'+S.areas.filter(function(x){return x.ativo}).map(function(x){return '<button class="chip'+(x.id===f.area?" on":"")+'" data-a="fArea" data-v="'+x.id+'">'+esc(x.nome)+' · '+brl(x.preco)+'</button>'}).join("")+'</div></div>'+
 '<div class="fld"><div class="row between"><span class="lbl" style="margin:0">Data</span>'+navMes(f.cy,f.cm,"fMes")+'</div><div class="card" style="padding:12px">'+calendario(a,f.cy,f.cm,f.data,"fDia",true)+legendaCal()+'</div><span class="hint">'+(f.data?"Escolhida: <b>"+fmtLong(f.data)+"</b>. ":"")+'Pela administração, a antecedência mínima do espaço não se aplica.</span></div>'+
 (a.modo==="integral"?'<div class="small muted">'+esc(turnoLabel(a,"integral"))+'</div>':'<div class="fld"><span class="lbl">Turno</span><div class="chips">'+a.turnos.map(function(t){return '<button class="chip'+(f.turno===t.id?" on":"")+'" data-a="fTurno" data-v="'+t.id+'">'+esc(turnoLabel(a,t.id))+'</button>'}).join("")+'</div></div>')+
 (c?'<div class="errmsg" role="alert">'+esc(c.msg)+'</div>':'<div class="okmsg">Data livre. Reserva incluída pela administração é confirmada na hora, mesmo com aprovação manual.</div>')+
 '<label class="row"><input type="checkbox" data-a="fIsenta" '+(f.isenta?"checked":"")+' style="width:22px;height:22px;margin:0;accent-color:var(--sea)"><span class="small">Isentar taxa ('+brl(a.preco)+')</span></label>'+
 '<label class="row" style="align-items:flex-start"><input type="checkbox" data-a="fTermos" '+(f.termos?"checked":"")+' style="width:22px;height:22px;margin:0;flex-shrink:0;accent-color:var(--sea)"><span class="small">O morador foi informado dos termos de uso e concordou.</span></label>'+
 '<button class="btn block" data-a="sSalvaRes" '+(c||!f.termos?"disabled":"")+'>Incluir reserva</button></section>';
 return h;
}
function sReservas(){
 var fil=S.ui.filRes||"ativas",l=S.reservas.filter(function(r){return fil==="ativas"?ativa(r)&&r.data>=TODAY:fil==="aguardando"?r.status==="aguardando":fil==="canc"?(r.status==="cancelada"||r.status==="recusada"):true}).sort(function(a,b){return a.data<b.data?-1:1});
 var h='<main class="wrap page">';
 if(S.ui.form==="novaRes")h+=formNovaRes();else if(S.ui.form==="cal")h+=calAdmin();
 if(S.ui.form!=="novaRes")h+='<div class="g2"><button class="btn" data-a="sNovaRes">'+ic("calplus",20)+'Incluir reserva</button><button class="btn out" data-a="sVerCal"'+(S.ui.form==="cal"?' aria-pressed="true"':'')+'>'+ic("cal",20)+'Ver calendário</button></div>';
 if(S.ui.okRes)h+='<div class="okmsg" role="status">'+esc(S.ui.okRes)+'</div>';
 h+='<div class="chips">'+[["ativas","Próximas"],["aguardando","Aguardando"],["canc","Canceladas/recusadas"],["todas","Todas"]].map(function(x){return '<button class="chip'+(fil===x[0]?" on":"")+'" data-a="filRes" data-v="'+x[0]+'">'+x[1]+'</button>'}).join("")+'</div>';
 h+=l.length?l.map(function(r){return cardReservaAdm(r,true)}).join(""):empty("Nenhuma reserva neste filtro.");
 return h+'<p class="xs muted">Inclusões e cancelamentos feitos pela administração ficam na auditoria, e o morador é avisado por e-mail e no app.</p></main>';
}
var PERFIS={morador:["Morador","Reservas e encomendas da própria unidade","Ver e gerenciar as próprias reservas e convidados, consultar a disponibilidade e ver somente as encomendas do próprio apartamento."],porteiro:["Porteiro","Usa o celular compartilhado da portaria","Não tem login próprio: usa o acesso único da portaria e escolhe o próprio nome antes de registrar encomendas ou retiradas. Tudo fica registrado no nome dele. Vê a agenda de reservas e hóspedes autorizados. Não acessa o painel."],sindico:["Síndico","Acesso total à administração","Tudo do painel: reservas (incluir, aprovar, recusar, cancelar), áreas comuns, bloqueios, usuários, relatórios, auditoria e configurações."],administracao:["Administração","Mesmo acesso do síndico","As mesmas permissões do síndico."]};
function sitPill(s){return '<span class="pill '+(s==="Ativo"?"p-ok":s==="Convite pendente"?"p-warn":s==="Desativado"?"p-off":"p-bad")+'">'+esc(s)+'</span>'}
function formUsuario(){
 var f=S.f,ed=String(S.ui.form||"").indexOf("u:")===0;
 var h='<section class="card" style="border:2px solid var(--sea)"><div class="row between"><h2 class="h2">'+(ed?"Editar usuário":"Cadastrar usuário")+'</h2><button class="iconbtn ghost" data-a="sFechaForm" aria-label="Fechar">'+ic("x")+'</button></div>'+
 '<div class="fld"><span class="lbl">Perfil de acesso</span><div class="g2">'+Object.keys(PERFIS).map(function(k){return '<button class="optcard'+(f.perfil===k?" on":"")+'" data-a="fPerfil" data-v="'+k+'"><b>'+PERFIS[k][0]+'</b><span class="xs">'+PERFIS[k][1]+'</span></button>'}).join("")+'</div></div>'+
 '<div class="fld"><label class="lbl" for="u-nome">Nome completo</label><input id="u-nome" class="in" data-bind="f.nome" value="'+esc(f.nome)+'"></div>'+
 (f.perfil==="porteiro"?'<div class="note">'+ic("info",20)+'<span>Porteiros não precisam de e-mail. O nome aparece na tela "Quem está usando agora?" do celular da portaria.</span></div><div class="fld"><label class="lbl" for="u-pin">'+(S.real&&f.temPin?"Novo PIN de 4 dígitos (deixe em branco para manter o atual)":"PIN de 4 dígitos (opcional)")+'</label><input id="u-pin" class="in" type="password" inputmode="numeric" maxlength="4" autocomplete="new-password" data-bind="f.pin" value="'+esc(S.real?(f.pin||""):(f.pin||""))+'">'+(S.real&&f.temPin?'<label class="row"><input type="checkbox" data-a="fRemPin" '+(f.removerPin?"checked":"")+' style="width:22px;height:22px;margin:0;accent-color:var(--sea)"><span class="small">Remover o PIN deste porteiro</span></label>':'')+' <span class="hint">Só é pedido se "Exigir PIN do porteiro" estiver ligado em Configurações › Portaria (hoje: '+(S.cfg.exigirPin?"ligado":"desligado")+').</span></div>':'<div class="fld"><label class="lbl" for="u-mail">E-mail (usado para entrar)</label><input id="u-mail" class="in" type="email" data-bind="f.email" value="'+esc(f.email)+'"></div>')+
 '<div class="fld"><label class="lbl" for="u-tel">Telefone / WhatsApp (opcional)</label><input id="u-tel" class="in" inputmode="tel" data-bind="f.tel" value="'+esc(f.tel||"")+'"></div>'+
 (f.perfil==="morador"?'<label class="row" style="align-items:flex-start"><input type="checkbox" data-a="fWa" '+(f.wa?"checked":"")+' style="width:22px;height:22px;margin:0;flex-shrink:0;accent-color:var(--sea)"><span class="small">O morador autorizou receber aviso de encomendas por WhatsApp neste número.</span></label>':'');
 if(f.perfil==="morador")h+='<div class="g2"><div class="fld"><label class="lbl" for="u-apto">Apartamento</label><input id="u-apto" class="in" data-bind="f.apto" data-rerender="1" value="'+esc(f.apto||"")+'" placeholder="Ex.: 807 ou COB"></div><div class="fld"><label class="lbl" for="u-vinc">Vínculo</label><select id="u-vinc" class="in" data-bind="f.vinculo">'+VINCULOS.map(function(v){return '<option'+(f.vinculo===v?" selected":"")+'>'+v+'</option>'}).join("")+'</select></div></div>'+(f.apto&&!aptoValido(f.apto)?'<div class="errmsg">Unidade inexistente. Use o número (ex.: 807) ou a identificação de uma unidade fora do padrão (ex.: COB).</div>':'');
 if(f.perfil==="porteiro")h+='<div class="fld"><label class="lbl" for="u-turno">Turno</label><select id="u-turno" class="in" data-bind="f.turno">'+["Manhã (06h–14h)","Tarde (14h–22h)","Noite (22h–06h)","Folguista"].map(function(v){return '<option'+(f.turno===v?" selected":"")+'>'+v+'</option>'}).join("")+'</select></div>';
 if(f.perfil==="sindico")h+='<div class="fld"><label class="lbl" for="u-mand">Mandato até</label><input id="u-mand" class="in" type="date" data-bind="f.mandato" value="'+esc(f.mandato||"2027-12-31")+'"></div>';
 h+='<div class="note">'+ic("shield",20)+'<span><b>Este perfil pode:</b> '+PERFIS[f.perfil][2]+'</span></div>';
 if(ed)h+='<button class="switchrow" data-a="fAtivo" aria-pressed="'+(f.sit!=="Desativado")+'"><span><b style="display:block">Acesso ativo</b><span class="small muted">Desligar corta o acesso na hora</span></span><span class="toggle'+(f.sit!=="Desativado"?" on":"")+'"><i></i></span></button>';
 if(ed&&f.perfil==="morador")h+='<button class="switchrow" data-a="fAvEmail" aria-pressed="'+(f.avEmail!==false)+'"><span><b style="display:block">Aviso de encomenda por e-mail</b><span class="small muted">O morador também pode mudar no perfil dele</span></span><span class="toggle'+(f.avEmail!==false?" on":"")+'"><i></i></span></button>';
 if(ed&&f.perfil!=="porteiro")h+='<div class="g2"><button class="btn out sm" data-a="sGerarCod" data-v="'+esc(f.id)+'">Gerar código de acesso</button>'+(f.perfil==="morador"?'<button class="btn ghost sm" style="color:var(--bad)" data-a="sExcluirDados" data-v="'+esc(f.id)+'">Excluir dados pessoais</button>':'')+'</div>';
 h+=(S.ui.errForm?'<div class="errmsg" role="alert">'+esc(S.ui.errForm)+'</div>':'')+'<button class="btn block" data-a="sSalvaUser">'+(ed?"Salvar alterações":"Cadastrar e enviar convite")+'</button>'+
 '<p class="xs muted">'+(ed?"Alterações ficam registradas na auditoria.":"A pessoa recebe um e-mail de boas-vindas com o link do app e entra com o código enviado ao e-mail, sem senha.")+'</p></section>';
 return h;
}
function sUsuarios(){
 var tab=S.ui.usrTab||"moradores",q=(S.ui.buscaU||"").toLowerCase().trim();
 var l=S.usuarios.filter(function(u){return (tab==="equipe"?u.perfil!=="morador":u.perfil==="morador")&&(!q||u.nome.toLowerCase().indexOf(q)>=0||u.apto.indexOf(q)===0)}).sort(function(a,b){return (a.apto||"z")<(b.apto||"z")?-1:1});
 var nm=S.usuarios.filter(function(u){return u.perfil==="morador"}),unid=S.cfg.andares*S.cfg.porLado*2+S.extras.filter(function(e){return e.ativo}).length,com={};nm.forEach(function(u){com[u.apto]=1});
 var h='<main class="wrap page"><div class="kpis"><div class="kpi"><span class="k">Unidades</span><b>'+unid+'</b><span class="xs muted">'+S.cfg.andares+' andares × '+(S.cfg.porLado*2)+' + '+S.extras.filter(function(e){return e.ativo}).length+' fora do padrão</span></div><div class="kpi"><span class="k">Unidades com cadastro</span><b>'+Object.keys(com).length+'</b><span class="xs muted">'+nm.filter(function(u){return u.sit!=="Excluído"}).length+' moradores cadastrados'+(S.real?'':' (exemplo)')+'</span></div></div>';
 var seg='<div class="seg"><button class="'+(tab==="moradores"?"on":"")+'" data-a="usrTab" data-v="moradores">Moradores</button><button class="'+(tab==="equipe"?"on":"")+'" data-a="usrTab" data-v="equipe">Equipe</button><button class="'+(tab==="unidades"?"on":"")+'" data-a="usrTab" data-v="unidades">Unidades</button><button class="'+(tab==="solicitacoes"?"on":"")+'" data-a="usrTab" data-v="solicitacoes">Pedidos'+(solPendentes()?" ("+solPendentes()+")":"")+'</button></div>';
 if(tab==="unidades")return h+seg+sUnidades()+'</main>';
 if(tab==="solicitacoes")return h+seg+sSolicitacoes()+'</main>';
 if(S.ui.form==="novoUser"||String(S.ui.form||"").indexOf("u:")===0)h+=formUsuario();else h+='<button class="btn block" data-a="sNovoUser">'+ic("users",20)+'Cadastrar usuário</button>';
 if(S.ui.okUser)h+='<div class="okmsg" role="status">'+esc(S.ui.okUser)+'</div>';
 h+=seg+
 (tab==="equipe"?'<div class="note">'+ic("phone",20)+'<span><b>Acesso da portaria:</b> '+esc(S.cfg.portariaEmail)+'. Todos os porteiros usam este acesso no celular da portaria e escolhem o próprio nome antes de registrar.</span></div>':'')+
 '<div class="fld"><label class="lbl" for="u-busca">Buscar por nome'+(tab==="moradores"?" ou apartamento":"")+'</label><input id="u-busca" class="in" data-bind="ui.buscaU" data-filter="usr" value="'+esc(S.ui.buscaU||"")+'"></div>';
 h+='<div class="card tight"><div class="list">'+(l.length?l.map(function(u){return '<button class="li" data-a="sEditUser" data-v="'+u.id+'" data-s="'+esc((u.nome+" "+u.apto).toLowerCase())+'"><span class="av">'+(tab==="moradores"?u.apto:esc(ini(u.nome)))+'</span><span class="grow"><b>'+esc(u.nome)+'</b><span class="xs muted" style="display:block">'+(tab==="moradores"?esc(u.vinculo):PERFIS[u.perfil][0]+(u.turno?" · "+esc(u.turno):""))+' · '+(u.perfil==="porteiro"?"Usa o acesso da portaria":esc(maskMail(u.email)))+'</span></span>'+sitPill(u.sit)+'</button>'}).join(""):'')+'<p class="small muted" data-none="usr" style="padding:8px 0" '+(l.length?"hidden":"")+'>Ninguém encontrado.</p></div></div>';
 return h+'<p class="xs muted">Só síndico e administração cadastram usuários. Toque em uma pessoa para editar ou desativar.</p></main>';
}
function sUnidades(){
 var an=S.ui.uAndar||12,h='';
 h+='<section class="card"><h2 class="h2">Estrutura do prédio</h2><div class="small">'+S.cfg.andares+' andares, cada um com <b>Lado A</b> (finais '+faixaLado("A")+') e <b>Lado B</b> (finais '+faixaLado("B")+').</div><div class="small muted">Ex.: 1º andar · Lado A 101 a 1'+pad(S.cfg.porLado)+' · Lado B 1'+pad(S.cfg.porLado+1)+' a 1'+pad(S.cfg.porLado*2)+'. Total: '+(S.cfg.andares*S.cfg.porLado*2)+' apartamentos.</div><button class="btn ghost sm" style="align-self:flex-start;color:var(--sea);padding-left:0" data-a="go" data-v="config">Alterar estrutura em Configurações</button></section>';
 h+='<section class="card"><h2 class="h2">Consultar andar</h2><div class="grid6">';for(var i=1;i<=S.cfg.andares;i++)h+='<button class="numbtn'+(an===i?" on":"")+'" data-a="uAndar" data-v="'+i+'" aria-label="'+i+'º andar">'+i+'</button>';h+='</div>';
 var col=function(L){var ini=L==="A"?1:S.cfg.porLado+1,o='<div class="stack" style="gap:6px;min-width:0"><div class="xs muted" style="font-weight:800;letter-spacing:.05em">LADO '+L+'</div>';for(var k=ini;k<ini+S.cfg.porLado;k++){var n=String(an*100+k),m=moradoresDe(n).length;o+='<div class="row between" style="border:1px solid var(--line);border-radius:10px;padding:8px 10px;gap:6px"><b style="font-variant-numeric:tabular-nums">'+n+'</b><span class="pill '+(m?"p-ok":"p-off")+'">'+(m?m+(m>1?" morad.":" morad."):"Sem cadastro")+'</span></div>'}return o+'</div>'};
 h+='<div class="g2" style="gap:14px">'+col("A")+col("B")+'</div></section>';
 h+='<section class="stack g12"><div class="row between wrapr"><h2 class="h2">Unidades fora do padrão</h2>'+(S.ui.form&&String(S.ui.form).indexOf("extra")===0?'':'<button class="btn sm" data-a="sNovaExtra">+ Cadastrar unidade</button>')+'</div><p class="small muted">Unidades que não seguem a numeração por andar, como cobertura, administração ou apartamento do zelador.</p>';
 if(S.ui.okExtra)h+='<div class="okmsg" role="status">'+esc(S.ui.okExtra)+'</div>';
 if(S.ui.form&&String(S.ui.form).indexOf("extra")===0)h+=formExtra();
 h+=S.extras.length?S.extras.map(function(e){var m=moradoresDe(e.num).length;return '<section class="card tight"><div class="row between wrapr"><div><b style="font-size:17px">'+esc(e.nome)+'</b> <span class="pill p-sea">'+esc(e.num)+'</span></div>'+(e.ativo?'<span class="pill p-ok">Ativa</span>':'<span class="pill p-off">Inativa</span>')+'</div><div class="small muted">'+(e.tipo==="residencial"?"Residencial":"Uso do condomínio")+(e.local?" · "+esc(e.local):"")+' · '+m+(m===1?" morador":" moradores")+'</div><div class="xs muted">'+(e.encomendas?"Recebe encomendas":"Não recebe encomendas")+' · '+(e.reservas?"Pode reservar áreas comuns":"Não reserva áreas comuns")+'</div><button class="btn out sm" style="align-self:flex-start" data-a="sEditExtra" data-v="'+e.num+'">Editar</button></section>'}).join(""):empty("Nenhuma unidade fora do padrão.");
 return h+'</section>';
}
function formExtra(){
 var f=S.f,ed=S.ui.form!=="extra";
 var tog=function(k,t,d){return '<button class="switchrow" data-a="fxTog" data-v="'+k+'" aria-pressed="'+!!f[k]+'"><span><b style="display:block">'+t+'</b><span class="small muted">'+d+'</span></span><span class="toggle'+(f[k]?" on":"")+'"><i></i></span></button>'};
 return '<section class="card" style="border:2px solid var(--sea)"><div class="row between"><h2 class="h2">'+(ed?"Editar unidade":"Nova unidade fora do padrão")+'</h2><button class="iconbtn ghost" data-a="sFechaForm" aria-label="Fechar">'+ic("x")+'</button></div>'+
 '<div class="g2"><div class="fld"><label class="lbl" for="x-num">Identificação</label><input id="x-num" class="in" style="text-transform:uppercase" data-bind="f.num" value="'+esc(f.num)+'" placeholder="Ex.: COB, ZEL, 1901"'+(ed?" disabled":"")+'><span class="hint">Usada no lugar do número do apartamento.</span></div>'+
 '<div class="fld"><label class="lbl" for="x-nome">Nome</label><input id="x-nome" class="in" data-bind="f.nome" value="'+esc(f.nome)+'" placeholder="Ex.: Cobertura"></div></div>'+
 '<div class="fld"><span class="lbl">Tipo</span><div class="g2"><button class="optcard'+(f.tipo==="residencial"?" on":"")+'" data-a="fxTipo" data-v="residencial"><b>Residencial</b><span class="xs">Tem moradores, como um apartamento</span></button><button class="optcard'+(f.tipo==="condominio"?" on":"")+'" data-a="fxTipo" data-v="condominio"><b>Uso do condomínio</b><span class="xs">Administração, zeladoria, depósito</span></button></div></div>'+
 '<div class="fld"><label class="lbl" for="x-local">Localização (opcional)</label><input id="x-local" class="in" data-bind="f.local" value="'+esc(f.local)+'" placeholder="Ex.: 19º andar, térreo"></div>'+
 tog("encomendas","Recebe encomendas","Aparece na tela de registro da portaria")+tog("reservas","Pode reservar áreas comuns","Moradores desta unidade fazem reservas")+tog("ativo","Unidade ativa","Inativa some das telas, mas o histórico fica guardado")+
 (S.ui.errForm?'<div class="errmsg" role="alert">'+esc(S.ui.errForm)+'</div>':'')+'<button class="btn block" data-a="sSalvaExtra">Salvar unidade</button></section>';
}
function sEncomendas(){
 var tab=S.ui.sEncTab||"pend",st={pend:"pendente",ret:"retirada",exc:"excluida"}[tab],l=S.encomendas.filter(function(e){return e.status===st}).sort(function(a,b){return (a.data+a.hora)<(b.data+b.hora)?1:-1});
 var h='<main class="wrap page"><div class="seg"><button class="'+(tab==="pend"?"on":"")+'" data-a="sEncTab" data-v="pend">Na portaria</button><button class="'+(tab==="ret"?"on":"")+'" data-a="sEncTab" data-v="ret">Retiradas</button><button class="'+(tab==="exc"?"on":"")+'" data-a="sEncTab" data-v="exc">Excluídas</button></div>';
 if(S.ui.okEnc)h+='<div class="okmsg" role="status">'+esc(S.ui.okEnc)+'</div>';
 h+=l.length?l.map(function(e){return '<section class="card tight"><div class="row between"><b style="font-size:18px;color:var(--sea-strong)">Apto '+e.apto+'</b>'+(tab==="pend"?avisoPill(e):tab==="ret"?'<span class="pill p-ok">Retirada</span>':'<span class="pill p-off">Excluída</span>')+'</div><div class="row">'+(e.foto?'<img class="thumb" src="'+e.foto+'" alt="Foto da encomenda">':'')+'<div class="grow"><div class="small">'+(e.temFoto&&!e.foto?'<button class="btn ghost sm" style="float:right;color:var(--sea)" data-a="verFoto" data-v="'+e.id+'">'+ic("cam",16)+'Foto</button>':'')+''+esc(e.tipo)+(e.rem?" · "+esc(e.rem):"")+'</div><div class="xs muted">Chegou '+esc(quando(e.data,e.hora))+' · recebida por '+esc(e.porteiro)+' · cód. '+e.cod+'</div></div></div>'+(e.waEm?'<div class="xs" style="color:#178A45;font-weight:700">WhatsApp enviado '+esc(e.waEm)+'</div>':'')+(tab==="ret"?'<div class="xs">Retirada '+esc(e.em)+' por <b>'+esc(e.por)+'</b> · entregue por '+esc(e.entregue)+'</div>':'')+(e.editEm?'<div class="xs muted">Alterada '+esc(e.editEm)+' por '+esc(e.editPor)+'</div>':'')+
 (tab==="exc"?'<div class="xs" style="color:var(--bad);font-weight:600">Excluída '+esc(e.excEm)+' por '+esc(e.excPor)+' · motivo: '+esc(e.excMotivo)+'</div>':'<div class="row" style="gap:8px"><button class="btn out sm" data-a="encEditar" data-v="'+e.id+'">Editar</button><button class="btn ghost sm" style="color:var(--bad)" data-a="encExcluir" data-v="'+e.id+'">Excluir</button></div>')+'</section>'}).join(""):empty(tab==="exc"?"Nenhuma encomenda excluída.":"Nada por aqui.");
 return h+'<p class="xs muted">Alterações e exclusões ficam na auditoria. Ao excluir, a foto é apagada na hora.</p></main>';
}
function formArea(){
 var f=S.f;
 var h='<section class="card" style="border:2px solid var(--sea)"><div class="row between"><h2 class="h2">'+(S.ui.form==="novaArea"?"Nova área comum":"Editar "+esc(f.nome))+'</h2><button class="iconbtn ghost" data-a="sFechaForm" aria-label="Fechar">'+ic("x")+'</button></div>'+
 '<div class="fld"><label class="lbl" for="a-nome">Nome do espaço</label><input id="a-nome" class="in" data-bind="f.nome" value="'+esc(f.nome)+'" placeholder="Ex.: Espaço gourmet"></div>'+
 '<div class="g2"><div class="fld"><label class="lbl" for="a-cap">Capacidade</label><input id="a-cap" class="in" inputmode="numeric" data-bind="f.cap" value="'+esc(f.cap)+'"></div><div class="fld"><label class="lbl" for="a-preco">Taxa (R$)</label><input id="a-preco" class="in" inputmode="decimal" data-bind="f.preco" value="'+esc(f.preco)+'"></div></div>'+
 '<div class="fld"><span class="lbl">Como o espaço é reservado?</span><div class="g2"><button class="optcard'+(f.modo==="integral"?" on":"")+'" data-a="fModo" data-v="integral"><b>Período integral</b><span class="xs">Uma reserva por dia</span></button><button class="optcard'+(f.modo==="turnos"?" on":"")+'" data-a="fModo" data-v="turnos"><b>Por turnos</b><span class="xs">O dia é dividido em turnos</span></button></div></div>';
 if(f.modo==="integral")h+='<div class="g2"><div class="fld"><label class="lbl" for="a-abre">Abre às</label><input id="a-abre" class="in" type="time" data-bind="f.abre" value="'+esc(f.abre)+'"></div><div class="fld"><label class="lbl" for="a-fecha">Fecha às</label><input id="a-fecha" class="in" type="time" data-bind="f.fecha" value="'+esc(f.fecha)+'"></div></div>';
 else{h+='<div class="stack">'+f.turnos.map(function(t,i){return '<div class="card tight" style="background:var(--bg)"><div class="row between"><b class="small">Turno '+(i+1)+'</b><button class="btn ghost sm" style="color:var(--bad)" data-a="fRemTurno" data-v="'+i+'">Remover</button></div><input class="in" aria-label="Nome do turno '+(i+1)+'" data-bind="f.turnos.'+i+'.nome" value="'+esc(t.nome)+'"><div class="g2"><input class="in" type="time" aria-label="Início do turno '+(i+1)+'" data-bind="f.turnos.'+i+'.ini" value="'+esc(t.ini)+'"><input class="in" type="time" aria-label="Fim do turno '+(i+1)+'" data-bind="f.turnos.'+i+'.fim" value="'+esc(t.fim)+'"></div></div>'}).join("")+'<button class="btn out sm" data-a="fAddTurno">+ Adicionar turno</button></div>'}
 h+='<button class="switchrow" data-a="fManual" aria-pressed="'+f.manual+'"><span><b style="display:block">Aprovação manual</b><span class="small muted">'+(f.manual?"Síndico ou administração aprova cada pedido":"Desligada: confirma na hora, se a data estiver livre")+'</span></span><span class="toggle manual'+(f.manual?" on":"")+'"><i></i></span></button>'+
 '<div class="g2"><div class="fld"><label class="lbl" for="a-amin">Antecedência mínima (dias)</label><input id="a-amin" class="in" inputmode="numeric" data-bind="f.antMin" value="'+esc(f.antMin)+'"></div><div class="fld"><label class="lbl" for="a-amax">Antecedência máxima (dias)</label><input id="a-amax" class="in" inputmode="numeric" data-bind="f.antMax" value="'+esc(f.antMax==null?90:f.antMax)+'"></div></div>'+
 '<div class="g2"><div class="fld"><label class="lbl" for="a-canc">Cancelar sem custo até (h antes)</label><input id="a-canc" class="in" inputmode="numeric" data-bind="f.canc" value="'+esc(f.canc)+'"></div><div class="fld"><label class="lbl" for="a-lim">Reservas por apto no mês (0 = sem limite)</label><input id="a-lim" class="in" inputmode="numeric" data-bind="f.limite" value="'+esc(f.limite==null?0:f.limite)+'"></div></div>'+
 '<div class="fld"><span class="lbl">Este espaço exige termo de uso?</span><div class="g2"><button class="optcard'+(f.exigeTermo?" on":"")+'" data-a="fExigeTermo" data-v="1"><b>Sim</b><span class="xs">O morador lê e aceita o termo em PDF</span></button><button class="optcard'+(!f.exigeTermo?" on":"")+'" data-a="fExigeTermo" data-v="0"><b>Não</b><span class="xs">Vale o texto de regras abaixo</span></button></div></div>'+
 (f.exigeTermo?'<div class="card tight stack" style="background:var(--bg)"><div class="small">'+(f.termoNome?'<b>Novo arquivo:</b> '+esc(f.termoNome)+' <span class="muted">(é guardado ao tocar em Salvar)</span>':f.temTermo?'<b>Termo anexado</b> em '+esc(f.termoVersao)+' · <a href="#" data-a="abrirTermo" data-v="'+esc(f.id)+'">ver termo</a>':'<b>Nenhum termo anexado.</b> Anexe o PDF para salvar.')+'</div>'+
  '<label class="lbl" for="a-pdf">'+(f.temTermo||f.termoNome?"Trocar o arquivo":"Anexar o termo (PDF, até 5 MB)")+'</label><input id="a-pdf" class="in" type="file" accept="application/pdf,.pdf" data-pdf="1"></div>':'')+
 '<div class="fld"><label class="lbl" for="a-termos">Texto de regras (aparece para o morador)</label><textarea id="a-termos" class="in" data-bind="f.termos">'+esc(f.termos)+'</textarea></div>'+
 '<button class="switchrow" data-a="fAtivoArea" aria-pressed="'+f.ativo+'"><span><b style="display:block">Espaço ativo</b><span class="small muted">Aparece para os moradores</span></span><span class="toggle'+(f.ativo?" on":"")+'"><i></i></span></button>'+
 (S.ui.errForm?'<div class="errmsg" role="alert">'+esc(S.ui.errForm)+'</div>':'')+'<button class="btn block" data-a="sSalvaArea">Salvar</button></section>';
 return h;
}
function sAreas(){
 var h='<main class="wrap page">';
 if(S.ui.form==="novaArea"||(S.ui.form&&S.ui.form.indexOf&&S.ui.form.indexOf("area:")===0))h+=formArea();else h+='<button class="btn block" data-a="sNovaArea">+ Nova área comum</button>';
 if(S.ui.okArea)h+='<div class="okmsg" role="status">'+esc(S.ui.okArea)+'</div>';
 S.areas.forEach(function(a){
  h+='<section class="card"><div class="row between"><div><b style="font-size:17px">'+esc(a.nome)+'</b><div class="small muted">Até '+a.cap+' pessoas · '+brl(a.preco)+(a.ativo?"":" · inativo")+'</div><div class="xs muted">'+(a.modo==="integral"?esc(turnoLabel(a,"integral")):"Por turnos: "+a.turnos.map(function(t){return esc(t.nome)}).join(", "))+'</div>'+(S.real?'<div class="xs muted">'+(a.temTermo?'Termo de uso: PDF de '+esc(a.termoVersao)+' · <a href="#" data-a="abrirTermo" data-v="'+a.id+'">ver</a>':a.exigeTermo?'<b style="color:var(--bad)">Termo exigido, mas sem PDF</b>':'Sem termo em PDF: vale o texto de regras')+'</div>':'')+'</div><button class="btn out sm" data-a="sEditArea" data-v="'+a.id+'">Editar</button></div>'+
  '<button class="switchrow" data-a="sToggleManual" data-v="'+a.id+'" aria-pressed="'+a.manual+'" style="border:0"><span><b style="display:block">Aprovação '+(a.manual?"manual":"automática")+'</b><span class="small muted">'+(a.manual?"Síndico ou administração aprova":"Confirma na hora, se livre")+'</span></span><span class="toggle manual'+(a.manual?" on":"")+'"><i></i></span></button></section>';
 });
 return h+'</main>';
}
function sBloqueios(){
 var f=S.f,h='<main class="wrap page">';
 if(S.ui.form==="bloq"){
  h+='<section class="card" style="border:2px solid var(--sea)"><div class="row between"><h2 class="h2">Novo bloqueio</h2><button class="iconbtn ghost" data-a="sFechaForm" aria-label="Fechar">'+ic("x")+'</button></div>'+
  '<div class="fld"><label class="lbl" for="b-area">Espaço</label><select id="b-area" class="in" data-bind="f.area"><option value="todas">Todos os espaços</option>'+S.areas.map(function(a){return '<option value="'+a.id+'"'+(f.area===a.id?" selected":"")+'>'+esc(a.nome)+'</option>'}).join("")+'</select></div>'+
  '<div class="g2"><div class="fld"><label class="lbl" for="b-de">De</label><input id="b-de" class="in" type="date" data-bind="f.de" data-rerender="1" value="'+esc(f.de)+'"></div><div class="fld"><label class="lbl" for="b-ate">Até</label><input id="b-ate" class="in" type="date" data-bind="f.ate" data-rerender="1" value="'+esc(f.ate)+'"></div></div>'+
  '<div class="fld"><label class="lbl" for="b-mot">Motivo (os moradores veem)</label><input id="b-mot" class="in" data-bind="f.motivo" value="'+esc(f.motivo)+'"></div>'+
  (S.ui.errForm?'<div class="errmsg" role="alert">'+esc(S.ui.errForm)+'</div>':'')+'<button class="btn block" data-a="sSalvaBloq">Salvar bloqueio</button></section>';
 }else h+='<button class="btn block" data-a="sNovoBloq">+ Novo bloqueio</button>';
 if(S.ui.okBloq)h+='<div class="okmsg" role="status">'+esc(S.ui.okBloq)+'</div>';
 h+=S.bloqueios.length?S.bloqueios.map(function(b){return '<section class="card tight"><div class="row between"><b>'+fmtD(b.de)+(b.ate!==b.de?" a "+fmtD(b.ate):"")+'</b><button class="btn ghost sm" style="color:var(--bad)" data-a="sRemBloq" data-v="'+b.id+'">Remover</button></div><div class="small">'+(b.area==="todas"?"Todos os espaços":esc((area(b.area)||{nome:"Espaço removido"}).nome))+' · '+esc(b.motivo)+'</div><div class="xs muted">Criado por '+esc(b.autor)+'</div></section>'}).join(""):empty("Nenhum bloqueio ativo.");
 return h+'</main>';
}
function sRelatorios(){
 var conf=S.reservas.filter(function(r){return r.status==="confirmada"}),por={};S.areas.forEach(function(a){por[a.id]=0});conf.forEach(function(r){por[r.area]=(por[r.area]||0)+1});
 var max=Math.max.apply(null,Object.keys(por).map(function(k){return por[k]}).concat([1])),taxa=conf.filter(function(r){return !r.isenta}).reduce(function(s,r){return s+area(r.area).preco},0);
 var enc=S.encomendas,ret=enc.filter(function(e){return e.status==="retirada"});
 var h='<main class="wrap page"><div class="kpis"><div class="kpi"><span class="k">Encomendas registradas</span><b>'+enc.length+'</b><span class="xs muted">'+ret.length+' já retiradas</span></div><div class="kpi"><span class="k">Taxas de reserva</span><b>'+brl(taxa)+'</b><span class="xs muted">A lançar nos boletos</span></div></div>'+
 '<section class="card"><h2 class="h2">Reservas confirmadas por espaço</h2>'+S.areas.map(function(a,i){return '<div class="stack" style="gap:4px"><div class="row between small"><span>'+esc(a.nome)+'</span><b>'+por[a.id]+'</b></div><div class="bar"><i style="width:'+Math.round(por[a.id]/max*100)+'%;background:'+(i%2?"var(--sun)":"var(--sea)")+'"></i></div></div>'}).join("")+'</section>'+
 '<p class="xs muted">Números calculados a partir dos dados de exemplo do protótipo. Na versão final haverá filtro por mês e exportação para planilha.</p></main>';
 return h;
}
function sAuditoria(){return '<main class="wrap page"><div class="card tight"><div class="list">'+S.audit.map(function(l){return '<div class="li" style="align-items:flex-start"><span class="xs muted" style="min-width:74px;font-variant-numeric:tabular-nums;padding-top:2px">'+esc(l.q)+'</span><span class="grow small"><b>'+esc(l.acao)+'</b><span style="display:block">'+esc(l.det)+'</span><span class="xs muted">'+esc(l.quem)+'</span></span></div>'}).join("")+'</div></div><p class="xs muted">O histórico não pode ser editado nem apagado pelo app. As ações que você fizer neste protótipo aparecem aqui.</p></main>'}
function sConfig(){
 var f=S.f;if(f.andares==null)Object.assign(f,S.cfg);
 var num=function(id,k,t,hint){return '<div class="fld"><label class="lbl" for="'+id+'">'+t+'</label><input id="'+id+'" class="in" inputmode="numeric" data-bind="f.'+k+'" value="'+esc(f[k])+'">'+(hint?'<span class="hint">'+hint+'</span>':'')+'</div>'};
 return '<main class="wrap page"><section class="card"><h2 class="h2">Condomínio</h2><div class="fld"><label class="lbl" for="c-nome">Nome</label><input id="c-nome" class="in" data-bind="f.nome" value="'+esc(f.nome)+'"></div>'+
 '<div class="g2"><div class="fld"><label class="lbl" for="c-and">Andares</label><input id="c-and" class="in" inputmode="numeric" data-bind="f.andares" value="'+esc(f.andares)+'"></div><div class="fld"><label class="lbl" for="c-apt">Apartamentos por lado</label><input id="c-apt" class="in" inputmode="numeric" data-bind="f.porLado" data-rerender="1" value="'+esc(f.porLado)+'"></div></div>'+
 '<p class="hint">Cada andar tem Lado A e Lado B. Com '+esc(f.porLado)+' por lado: Lado A finais 01 a '+pad(+f.porLado||0)+', Lado B finais '+pad((+f.porLado||0)+1)+' a '+pad((+f.porLado||0)*2)+'. Ex.: 1º andar 101 a 1'+pad(+f.porLado||0)+' (A) e 1'+pad((+f.porLado||0)+1)+' a 1'+pad((+f.porLado||0)*2)+' (B). Unidades fora do padrão são cadastradas em Usuários › Unidades.</p></section>'+
 '<section class="card"><h2 class="h2">Sessão e acesso</h2><p class="small muted">Por quanto tempo cada perfil fica conectado sem precisar de novo código. O prazo recomeça a cada uso.</p><div class="g3c">'+num("c-sm","sesMorador","Morador (dias)")+num("c-sp","sesPortaria","Portaria (dias)")+num("c-sa","sesAdm","Síndico e adm. (dias)")+'</div>'+
 '<div class="g2">'+num("c-cod","codigoMin","Validade do código (min)")+num("c-tent","codigoTent","Tentativas por código")+'</div></section>'+
 '<section class="card"><h2 class="h2">Portaria</h2><div class="fld"><label class="lbl" for="c-pmail">E-mail do acesso único da portaria</label><input id="c-pmail" class="in" type="email" data-bind="f.portariaEmail" value="'+esc(f.portariaEmail)+'"><span class="hint">Usado só no celular da portaria. Os porteiros escolhem o nome antes de registrar.</span></div>'+
 num("c-prel","portRelogin","Perguntar o porteiro de novo após (minutos sem uso)")+
 '<button class="switchrow" data-a="fPin" aria-pressed="'+!!f.exigirPin+'"><span><b style="display:block">Exigir PIN do porteiro</b><span class="small muted">Depois de tocar no nome, o porteiro digita o PIN de 4 dígitos cadastrado na ficha dele</span></span><span class="toggle'+(f.exigirPin?" on":"")+'"><i></i></span></button></section>'+
 '<section class="card"><h2 class="h2">Locação / temporada</h2>'+num("c-lant","locAntMin","Antecedência mínima do pedido (dias)")+'</section>'+
 '<section class="card"><h2 class="h2">Permissões por vínculo</h2><p class="small muted">Desligadas, todos os moradores da unidade têm o mesmo acesso, seja qual for o vínculo.</p>'+
 [["locSoProp","Locação / temporada só pelo proprietário","Inquilino, familiar e dependente não conseguem pedir autorização"],["inclSoTitular","Pedir inclusão só por proprietário ou inquilino","Familiar e dependente usam o app, mas não pedem inclusão de outras pessoas"]].map(function(d){return '<button class="switchrow" data-a="fTogCfg" data-v="'+d[0]+'" aria-pressed="'+!!f[d[0]]+'"><span><b style="display:block">'+d[1]+'</b><span class="small muted">'+d[2]+'</span></span><span class="toggle'+(f[d[0]]?" on":"")+'"><i></i></span></button>'}).join("")+'</section>'+
 '<section class="card"><h2 class="h2">Pedidos de cadastro</h2><div class="g2">'+num("c-cdia","cadDia","Pedidos aceitos por dia")+num("c-cpes","cadPessoas","Pessoas por pedido")+'</div><p class="hint">Protege contra excesso de pedidos pela tela de entrada. Passou do limite, a pessoa vê o aviso para procurar a administração.</p></section>'+
 '<section class="card"><h2 class="h2">Aviso por WhatsApp</h2>'+
 '<button class="switchrow" data-a="fWaAtivo" aria-pressed="'+!!f.waAtivo+'"><span><b style="display:block">Botão "Avisar no WhatsApp" na portaria</b><span class="small muted">Envio manual, pelo WhatsApp do aparelho da portaria</span></span><span class="toggle'+(f.waAtivo?" on":"")+'"><i></i></span></button>'+
 '<div class="fld"><label class="lbl" for="c-wanum">Número de WhatsApp da portaria</label><input id="c-wanum" class="in" inputmode="tel" data-bind="f.waNumero" value="'+esc(f.waNumero)+'"><span class="hint">Use um celular fixo da portaria com WhatsApp Business. Evite o número pessoal do porteiro.</span></div>'+
 '<div class="fld"><label class="lbl" for="c-wamod">Modelo da mensagem</label><textarea id="c-wamod" class="in" data-bind="f.waModelo" style="min-height:130px">'+esc(f.waModelo)+'</textarea><span class="hint">Campos automáticos: {nome} {apto} {tipo} {remetente} {hora} {codigo}</span></div></section>'+
 (function(){var tot=parseInt(f.cota,10)||0,res=parseInt(f.emailReserva,10)||0,av=tot-res,err=tot>100?"A conta @gmail.com envia no máximo 100 e-mails por dia.":res>=tot?"Os e-mails para códigos precisam ser menos que o total do dia.":"";
 return '<section class="card"><h2 class="h2">E-mails por dia</h2><p class="small muted">Divida o limite diário da conta do condomínio entre os avisos e os códigos de acesso.</p>'+
 '<div class="g2"><div class="fld"><label class="lbl" for="c-cota">Total por dia</label><input id="c-cota" class="in" inputmode="numeric" data-bind="f.cota" data-rerender="1" value="'+esc(f.cota)+'"><span class="hint">Máximo 100 na conta @gmail.com.</span></div>'+
 '<div class="fld"><label class="lbl" for="c-res">Códigos de acesso</label><input id="c-res" class="in" inputmode="numeric" data-bind="f.emailReserva" data-rerender="1" value="'+esc(f.emailReserva)+'"><span class="hint">Guardados para quem precisa entrar no app.</span></div></div>'+
 (err?'<div class="errmsg" role="alert">'+err+'</div>':'<div class="card tight" style="background:var(--bg)"><div class="row between"><span class="small">Avisos (encomendas, reservas, cadastro)</span><b>'+av+'</b></div><div class="row between"><span class="small">Códigos de acesso</span><b>'+res+'</b></div><div class="bar"><i style="width:'+Math.round(av/tot*100)+'%;background:var(--sea)"></i></div></div>')+
 num("c-lem","lembrete","Lembrete de retirada após (dias)")+'<p class="hint">Quando os avisos do dia acabam, eles ficam só no app e o envio por e-mail recomeça no dia seguinte, às 07:00. Os códigos de acesso continuam saindo. Se os códigos acabarem, a administração pode gerar um código na ficha do morador.</p></section>'})()+
 '<section class="card"><h2 class="h2">Armazenamento</h2><p class="small muted">Quanto tempo os arquivos ficam guardados no Drive do condomínio antes de serem apagados automaticamente.</p><div class="g3c">'+num("c-foto","fotoDias","Fotos de encomendas (dias após a retirada)")+num("c-ldoc","locDocsDias","Documentos de locação (dias após a hospedagem)")+num("c-bkd","bkpDias","Cópias de segurança (dias)")+'</div>'+
 '<div class="fld"><label class="lbl" for="c-bkp">Cópia de segurança automática</label><select id="c-bkp" class="in"><option>Diária (03:00)</option><option>Semanal (domingo 03:00)</option></select></div></section>'+
 (S.ui.errCfg?'<div class="errmsg" role="alert">'+esc(S.ui.errCfg)+'</div>':'')+'<button class="btn block" data-a="sSalvaCfg">Salvar configurações</button>'+(S.ui.okCfg?'<div class="okmsg" role="status">'+esc(S.ui.okCfg)+'</div>':'')+'</main>';
}

/* ================= FOLHAS ================= */
function vSheet(){
 var s=S.sheet;if(!s)return "";var h="";
 function head(t){return '<div class="row between wrap"><h2 style="font-size:20px;font-weight:800">'+esc(t)+'</h2><button class="iconbtn" data-a="fechaSheet" aria-label="Fechar">'+ic("x",20)+'</button></div>'}
 if(s.t==="foto"){var e=encPorId(s.id);
  h=head(e.tipo+" · "+(e.rem||"sem remetente"))+'<div class="wrap stack g12"><div class="photo">'+(e.foto?'<img src="'+e.foto+'" alt="Foto da encomenda">':'<div class="stack" style="align-items:center;text-align:center;padding:20px">'+ic("box",48)+'<span class="small">A portaria não tirou foto desta encomenda.</span></div>')+'</div><p class="xs muted">A foto fica guardada em pasta privada e só aparece para moradores desta unidade e para a administração.</p></div>';}
 else if(s.t==="retirada"){var e2=encPorId(s.id),mor=moradoresDe(e2.apto),f=S.f;
  h=head("Registrar retirada")+'<div class="wrap stack g12"><div class="small">Apto <b>'+e2.apto+'</b> · '+esc(e2.tipo)+(e2.rem?" · "+esc(e2.rem):"")+'<div class="xs muted">Chegou '+esc(quando(e2.data,e2.hora))+'</div></div>'+
  '<div class="fld"><span class="lbl">Quem está retirando?</span><div class="chips">'+mor.map(function(m){return '<button class="chip'+(f.quem===m.nome?" on":"")+'" data-a="fQuem" data-v="'+esc(m.nome)+'">'+esc(m.nome)+'</button>'}).join("")+'<button class="chip'+(f.quem==="__outra"?" on":"")+'" data-a="fQuem" data-v="__outra">Outra pessoa</button></div></div>'+
  (f.quem==="__outra"?'<div class="fld"><label class="lbl" for="r-outra">Nome de quem retirou</label><input id="r-outra" class="in" data-bind="f.outra" value="'+esc(f.outra||"")+'" placeholder="Ex.: Ana (diarista)"></div>':'')+
  '<div class="note">'+ic("info",20)+'<span>Código desta encomenda: <b style="letter-spacing:.08em">'+e2.cod+'</b>. Use só para conferir, se quiser. Não é preciso digitá-lo.</span></div>'+
  (S.ui.errForm?'<div class="errmsg" role="alert">'+esc(S.ui.errForm)+'</div>':'')+'<button class="btn okb block" data-a="pConfRet">Confirmar retirada</button><button class="btn ghost block" data-a="fechaSheet">Cancelar</button></div>';}
 else if(s.t==="cancelRes"){var r=resPorId(s.id),a=area(r.area);
  h=head("Cancelar reserva?")+'<div class="wrap stack g12"><p>'+esc(a.nome)+' em <b>'+fmtLong(r.data)+'</b>. Dentro do prazo, não há cobrança da taxa.</p><button class="btn badb block" data-a="confCancel" data-v="'+r.id+'">Sim, cancelar</button><button class="btn ghost block" data-a="fechaSheet">Manter reserva</button></div>';}
 else if(s.t==="termoPdf"){var a3=area(s.id),u3=termoUrl(a3);
  h=head("Termo de uso · "+a3.nome)+'<div class="wrap stack g12"><p class="small muted">Versão de '+esc(a3.termoVersao)+'.</p><a class="btn block" href="'+u3+'" target="_blank" rel="noopener">Abrir o termo (PDF)</a><p class="small muted">Se o celular baixar o arquivo, abra pelo aviso de download.</p></div>';}
 else if(s.t==="termos"){var a2=area(s.id);
  h=head("Regras de uso · "+a2.nome)+'<div class="wrap stack g12"><p>'+esc(a2.termos||REGRAS_PADRAO)+'</p>'+(a2.temTermo?'<button class="btn out block" data-a="abrirTermo" data-v="'+a2.id+'">Ler o termo de uso (PDF)</button>':'')+'<p class="small muted">Capacidade: '+a2.cap+' pessoas. Cancelamento sem custo até '+a2.canc+' h antes. A taxa de '+brl(a2.preco)+' é lançada no boleto do condomínio.</p></div>';}
 else if(s.t==="instalar"){
  h=head("Instalar na tela inicial")+'<div class="wrap stack g12"><div class="card tight"><b>Android (Chrome)</b><p class="small">Abra o link do app, toque no menu ⋮ e escolha <b>Adicionar à tela inicial</b>.</p></div><div class="card tight"><b>iPhone (Safari)</b><p class="small">Abra o link do app, toque em <b>Compartilhar</b> e escolha <b>Adicionar à Tela de Início</b>.</p></div><p class="xs muted">O ícone abre o app direto, como um aplicativo comum.</p></div>';}
 else if(s.t==="lgpd"){
  h=head("Privacidade e meus dados")+'<div class="wrap stack g12"><p class="small">O app guarda só o necessário: nome, e-mail, telefone opcional, apartamento, reservas, convidados e encomendas da sua unidade.</p><p class="small">Moradores de outras unidades não veem seus dados. Fotos e listas de convidados ficam em área restrita da administração.</p><button class="btn out block" data-a="toastMsg" data-v="No app final, a administração recebe o pedido e envia uma cópia dos seus dados por e-mail.">Pedir cópia dos meus dados</button><button class="btn ghost block" style="color:var(--bad)" data-a="toastMsg" data-v="No app final, o pedido de exclusão vai para a administração, que responde em até 15 dias.">Pedir exclusão da conta</button></div>';}
 else if(s.t==="contato"){
  h=head("Falar com a administração")+'<div class="wrap stack g12"><div class="card tight"><span class="xs muted">E-mail</span><b>administracao@edmarapendi.com.br</b><span class="xs muted">Telefone</span><b>(21) 3333-0000</b><span class="xs muted">Atendimento</span><b>Seg a sex, 9h às 17h</b></div><p class="xs muted">Contatos fictícios do protótipo.</p></div>';}
 else if(s.t==="wa"){var we=encPorId(s.id),ds=waDest(we.apto),dest=ds.filter(function(u){return String(u.id)===String(S.f.waDest)})[0]||ds[0],todos=moradoresDe(we.apto);
  if(S.f.waMsg==null)S.f.waMsg=waTexto(we,dest);
  if(s.stage!=="chat"){
   var meu=soDig(S.f.waTeste),link=meu.length>=10&&meu.length<=11?"https://wa.me/55"+meu+"?text="+encodeURIComponent(S.f.waMsg):"";
   h=head("Avisar no WhatsApp")+'<div class="wrap stack g12"><div class="small">Apto <b>'+we.apto+'</b> · '+esc(we.tipo)+(we.rem?" · "+esc(we.rem):"")+'</div>'+
   '<div class="fld"><span class="lbl">Enviar para</span><div class="chips">'+ds.map(function(u){return '<button class="chip'+(dest&&u.id===dest.id?" on":"")+'" data-a="waDest" data-v="'+u.id+'">'+esc(u.nome.split(" ")[0])+' · '+esc(u.tel)+'</button>'}).join("")+'</div>'+
   (todos.length>ds.length?'<span class="hint">'+todos.filter(function(u){return ds.indexOf(u)<0}).map(function(u){return esc(u.nome)}).join(", ")+': sem WhatsApp autorizado.</span>':'')+'</div>'+
   '<div class="fld"><label class="lbl" for="wa-msg">Mensagem (pode ajustar antes de enviar)</label><textarea id="wa-msg" class="in" data-bind="f.waMsg" style="min-height:150px">'+esc(S.f.waMsg)+'</textarea></div>'+
   '<button class="btn wa block" data-a="waChat">'+ic("wa",20)+'Abrir WhatsApp</button>'+
   '<p class="xs muted">Sai do WhatsApp deste aparelho, número da portaria '+esc(S.cfg.waNumero)+'. O porteiro confere e toca em enviar. Nada é enviado sozinho.</p>'+
   '<details class="card tight"'+(S.ui.waDet?" open":"")+'><summary data-a="waDet" style="font-weight:700;cursor:pointer;min-height:32px">Testar no meu WhatsApp de verdade</summary><p class="small muted">Digite o seu próprio número com DDD. O WhatsApp abre numa conversa com você mesmo, com esta mensagem pronta. Use só o seu número, para não mandar mensagem a um desconhecido.</p>'+
   '<div class="fld"><label class="lbl" for="wa-teste">Meu número (com DDD)</label><input id="wa-teste" class="in" inputmode="tel" data-bind="f.waTeste" data-live="1" value="'+esc(S.f.waTeste||"")+'" placeholder="21 99999-9999"></div>'+
   (link?'<a class="btn waout" href="'+esc(link)+'" target="_blank" rel="noopener">'+ic("wa",20)+'Abrir no meu WhatsApp</a>':'<span class="hint">Digite DDD + número (10 ou 11 dígitos).</span>')+'</details></div>';
  }else{
   var enviado=!!s.sent;
   h=head("WhatsApp da portaria")+'<div class="wrap stack g12"><div class="note">'+ic("info",20)+'<span>Simulação. No aparelho da portaria, o WhatsApp real abre nesta conversa com a mensagem já digitada.</span></div>'+
   '<div class="wa-screen"><div class="wa-head"><span class="av">'+esc(ini(dest.nome))+'</span><span class="grow"><b style="display:block">'+esc(dest.nome)+'</b><span class="xs" style="opacity:.85">+55 '+esc(dest.tel)+'</span></span></div>'+
   '<div class="wa-body"><span class="wa-day">HOJE</span>'+(enviado?'<div class="wa-bubble">'+esc(S.f.waMsg)+'<span class="meta">'+esc(s.hora)+' <b>✓✓</b></span></div>':'')+'</div>'+
   (enviado?'':'<div class="wa-input"><div class="box">'+esc(S.f.waMsg)+'</div><button class="wa-send" data-a="waEnviar" aria-label="Enviar mensagem">'+ic("send",22)+'</button></div>')+'</div>'+
   (enviado?'<div class="okmsg">Mensagem enviada para '+esc(dest.nome.split(" ")[0])+'. O envio fica registrado na encomenda.</div><button class="btn block" data-a="waVoltar">Voltar ao app da portaria</button>':'<p class="small muted" style="text-align:center">Toque no botão verde para enviar.</p><button class="btn ghost block" data-a="waEditar">Voltar e editar a mensagem</button>')+'</div>';
  }}
 else if(s.t==="doc"){var d=getPath(s.path)||{};
  h=head(d.nome||"Documento")+'<div class="wrap stack g12"><div class="photo" style="aspect-ratio:auto;min-height:200px">'+(d.tipo==="img"?'<img src="'+d.url+'" alt="Documento anexado" style="object-fit:contain">':'<div class="stack" style="align-items:center;text-align:center;padding:30px">'+ic("file",48)+'<span class="small">Arquivo PDF anexado. No app final ele abre para visualização.</span></div>')+'</div><p class="xs muted">Documento visível só para quem enviou, para a administração e para o síndico.</p></div>';}
 else if(s.t==="locMotivo"){var lm=loc(s.id),rec=s.acao==="recusar";
  h=head(rec?"Recusar solicitação":s.quem==="morador"?(lm.status==="pendente"?"Cancelar solicitação":"Cancelar autorização"):"Cancelar autorização")+'<div class="wrap stack g12"><div class="small">Apto <b>'+lm.apto+'</b> · '+esc(periodo(lm))+'</div>'+
  '<div class="fld"><label class="lbl" for="loc-mot">'+(rec?"Motivo da recusa (o morador vai ver)":"Motivo"+(s.quem==="morador"?" (opcional)":" (o morador vai ver)"))+'</label><textarea id="loc-mot" class="in" data-bind="f.motivo" placeholder="'+(rec?"Ex.: documento do carro ilegível":"Ex.: hospedagem cancelada pelo hóspede")+'">'+esc(S.f.motivo||"")+'</textarea></div>'+
  (rec?'<div class="chips">'+["Documento ilegível","Falta documento de um hóspede","CPF não confere com o documento","Período não permitido pelo regimento"].map(function(m){return '<button class="chip" data-a="motivoRapido" data-v="'+m+'">'+m+'</button>'}).join("")+'</div>':'')+
  (S.ui.errForm?'<div class="errmsg" role="alert">'+esc(S.ui.errForm)+'</div>':'')+
  '<button class="btn badb block" data-a="locConfMotivo">'+(rec?"Recusar e avisar o morador":"Confirmar cancelamento")+'</button><button class="btn ghost block" data-a="fechaSheet">Voltar</button></div>';}
 else if(s.t==="solRep"){var sx=S.solicitacoes.filter(function(x){return String(x.id)===String(s.id)})[0];
  h=head("Reprovar pedido")+'<div class="wrap stack g12"><div class="small"><b>'+esc(sx.nome)+'</b> · apto '+esc(sx.apto)+' · '+esc(sx.email)+'</div>'+
  '<div class="fld"><label class="lbl" for="sr-mot">Motivo (interno, a pessoa não vê)</label><textarea id="sr-mot" class="in" data-bind="f.motivo" placeholder="Ex.: não é morador da unidade">'+esc(S.f.motivo||"")+'</textarea></div>'+
  '<div class="chips">'+["Não é morador da unidade","Menor de idade","Pedido duplicado","Dados não conferem"].map(function(m){return '<button class="chip" data-a="motivoRapido" data-v="'+m+'">'+m+'</button>'}).join("")+'</div>'+
  '<div class="note">'+ic("info",20)+'<span>A pessoa recebe um e-mail curto: "Seu pedido de cadastro não foi aprovado. Procure a administração."</span></div>'+
  (S.ui.errForm?'<div class="errmsg" role="alert">'+esc(S.ui.errForm)+'</div>':'')+'<button class="btn badb block" data-a="solConfRep">Reprovar</button><button class="btn ghost block" data-a="fechaSheet">Voltar</button></div>';}
 else if(s.t==="encEdit"){var ee=encPorId(s.id),ff=S.f;
  h=head("Editar encomenda")+'<div class="wrap stack g12"><div class="xs muted">Registrada '+esc(quando(ee.data,ee.hora))+' por '+esc(ee.porteiro)+' · cód. '+ee.cod+'</div>'+
  '<div class="fld"><label class="lbl" for="ee-apto">Unidade</label><input id="ee-apto" class="in" data-bind="f.apto" value="'+esc(ff.apto)+'" placeholder="Ex.: 807 ou COB"></div>'+
  '<div class="fld"><span class="lbl">Tipo</span><div class="chips">'+TIPOS.map(function(t){return '<button class="chip'+(ff.tipo===t?" on":"")+'" data-a="eeTipo" data-v="'+t+'">'+t+'</button>'}).join("")+'</div></div>'+
  '<div class="fld"><label class="lbl" for="ee-rem">Remetente</label><input id="ee-rem" class="in" data-bind="f.rem" value="'+esc(ff.rem||"")+'"></div>'+
  (S.ui.errForm?'<div class="errmsg" role="alert">'+esc(S.ui.errForm)+'</div>':'')+'<button class="btn block" data-a="encSalvar">Salvar alteração</button><button class="btn ghost block" data-a="fechaSheet">Cancelar</button><p class="xs muted">Se mudar a unidade, a nova unidade é avisada no app.</p></div>';}
 else if(s.t==="encExcluir"){var ex=encPorId(s.id);
  h=head("Excluir encomenda?")+'<div class="wrap stack g12"><div class="small">Apto <b>'+ex.apto+'</b> · '+esc(ex.tipo)+(ex.rem?" · "+esc(ex.rem):"")+'<div class="xs muted">Chegou '+esc(quando(ex.data,ex.hora))+'</div></div>'+
  '<div class="fld"><label class="lbl" for="ex-mot">Motivo (fica na auditoria)</label><textarea id="ex-mot" class="in" data-bind="f.motivo" placeholder="Ex.: registrada em duplicidade">'+esc(S.f.motivo||"")+'</textarea></div>'+
  '<div class="chips">'+["Registrada em duplicidade","Unidade errada","Devolvida ao remetente"].map(function(m){return '<button class="chip" data-a="motivoRapido" data-v="'+m+'">'+m+'</button>'}).join("")+'</div>'+
  '<p class="small muted">Ela some da lista do morador e da portaria. '+(ex.foto?"A foto é apagada na hora. ":"")+'O registro continua na aba Excluídas.</p>'+
  (S.ui.errForm?'<div class="errmsg" role="alert">'+esc(S.ui.errForm)+'</div>':'')+'<button class="btn badb block" data-a="encConfExcluir">Excluir encomenda</button><button class="btn ghost block" data-a="fechaSheet">Voltar</button></div>';}
 else if(s.t==="codigo"){var cu=user(s.id);
  h=head("Código de acesso")+'<div class="wrap stack g12"><p class="small">Para <b>'+esc(cu.nome)+'</b> entrar quando o e-mail com o código não chega.</p><div style="font-size:36px;font-weight:800;letter-spacing:.18em;text-align:center;color:var(--sea-strong);font-variant-numeric:tabular-nums">'+s.cod.slice(0,3)+' '+s.cod.slice(3)+'</div>'+
  '<p class="small">Passe o código por telefone ou pessoalmente. Na tela de entrada, a pessoa digita o e-mail <b>'+esc(cu.email)+'</b> e depois este código. Vale por '+S.cfg.codigoMin+' minutos e uma única vez.</p><p class="xs muted">A geração fica registrada na auditoria.</p><button class="btn block" data-a="fechaSheet">Pronto</button></div>';}
 else if(s.t==="excluir"){var xu=user(s.id);
  h=head("Excluir dados pessoais?")+'<div class="wrap stack g12"><p class="small">Nome, e-mail e telefone de <b>'+esc(xu.nome)+'</b> serão apagados e o acesso ao app termina na hora.</p><p class="small">O histórico de reservas e encomendas do apto '+esc(xu.apto)+' continua, sem o nome dela. Não dá para desfazer.</p><p class="xs muted">Use quando a pessoa pedir a exclusão (LGPD) ou deixar o prédio.</p><button class="btn badb block" data-a="sConfExcluir">Excluir dados</button><button class="btn ghost block" data-a="fechaSheet">Voltar</button></div>';}
 else if(s.t==="pin"){var pp=user(s.id);
  h=head("PIN de "+pp.nome.split(" ")[0])+'<div class="wrap stack g12"><div class="fld"><label class="lbl" for="pin-in">Digite o seu PIN de 4 dígitos</label><input id="pin-in" class="in" type="password" inputmode="numeric" maxlength="4" autocomplete="off" data-bind="f.pinIn" value="'+esc(S.f.pinIn||"")+'" style="font-size:24px;letter-spacing:.4em;text-align:center"></div>'+
  (S.ui.errForm?'<div class="errmsg" role="alert">'+esc(S.ui.errForm)+'</div>':'')+'<button class="btn block" data-a="pinOk">Confirmar</button><p class="hint">'+(S.real?'':'No protótipo: João 1234 · Carlos 2580.')+' Esqueceu? A administração troca o PIN na sua ficha.</p></div>';}
 else if(s.t==="mais"){
  h=head("Mais opções")+'<div class="wrap"><div class="card tight"><div class="list">'+SMENU.filter(function(m){return ["painel","reservas","locacoes","usuarios"].indexOf(m[0])<0}).map(function(m){return '<button class="li" data-a="goMais" data-v="'+m[0]+'">'+ic(m[2])+'<span class="grow"><b>'+m[1]+'</b></span>'+ic("next",18)+'</button>'}).join("")+'<button class="li" data-a="sair" style="color:var(--bad)">'+ic("out")+'<span class="grow"><b>Sair</b></span></button></div></div></div>';}
 return '<div class="scrim" data-a="scrim"><div class="sheet" role="dialog" aria-modal="true">'+h+'</div></div>';
}

/* ================= RENDER ================= */
var lastKey="";
function render(){
 var app=document.getElementById("app"),h;
 if(!S.role)h=vLogin();else if(S.role==="morador")h=vMorador();else if(S.role==="portaria")h=vPortaria();else h=vSindico();
 var act=document.activeElement,actId=act&&act.id,selS=act&&act.selectionStart,selE=act&&act.selectionEnd;
 app.innerHTML=h+vSheet()+(S.toast?'<div class="toast" role="status">'+esc(S.toast)+'</div>':'');
 if(actId){var el=document.getElementById(actId);if(el&&el.focus){el.focus({preventScroll:true});try{if(selS!=null)el.setSelectionRange(selS,selE)}catch(e){}}}
 var key=S.role+"/"+S.screen+"/"+(S.ui.resId||"")+"/"+(S.ui.locId||"")+"/"+S.login.step+"/"+(S.ui.pedId||"")+"/"+(S.cad&&S.cad.res?1:0);if(key!==lastKey){window.scrollTo(0,0);lastKey=key}
 document.querySelectorAll("input[data-foto]").forEach(function(x){x.addEventListener("change",onFoto)});
 document.querySelectorAll("input[data-file]").forEach(function(x){x.addEventListener("change",onDoc)});
 document.querySelectorAll("input[data-pdf]").forEach(function(x){x.addEventListener("change",onPdf)});
 document.body.className=S.role?"logged r-"+S.role:"";
}
function onDoc(ev){var t=ev.target,file=t.files&&t.files[0],path=t.dataset.file;if(!file)return;
 if(!/^image\//.test(file.type)){setPath(path,{nome:file.name,tipo:"pdf"});render();return}
 var rd=new FileReader();rd.onload=function(){var img=new Image();img.onload=function(){var c=document.createElement("canvas"),k=Math.min(1,1200/Math.max(img.width,img.height));c.width=img.width*k;c.height=img.height*k;c.getContext("2d").drawImage(img,0,0,c.width,c.height);setPath(path,{nome:file.name,tipo:"img",url:c.toDataURL("image/jpeg",.82)});render()};img.src=rd.result};rd.readAsDataURL(file)}
var MQ=window.matchMedia?window.matchMedia("(min-width: 900px)"):null;function WIDE(){return !!(MQ&&MQ.matches)}
if(MQ){try{MQ.addEventListener("change",function(){render()})}catch(e){MQ.addListener(function(){render()})}}
var toastT;function toast(m){S.toast=m;clearTimeout(toastT);setTimeout(render,0);toastT=setTimeout(function(){S.toast="";render()},3800)}
function setPath(path,val){var p=path.split("."),o=S;for(var i=0;i<p.length-1;i++)o=o[p[i]];o[p[p.length-1]]=val}
function onPdf(ev){var file=ev.target.files&&ev.target.files[0];if(!file)return;
 if(!(file.type==="application/pdf"||/\.pdf$/i.test(file.name))){S.ui.errForm="Escolha um arquivo PDF. Se o termo está em Word, salve como PDF antes.";render();return}
 if(file.size>5*1024*1024){S.ui.errForm="O PDF tem mais de 5 MB. Salve uma versão menor (por exemplo, \"Reduzir tamanho\" ao salvar como PDF).";render();return}
 var rd=new FileReader();rd.onload=function(){S.f.termoPdf="data:application/pdf;base64,"+String(rd.result).split(",")[1];S.f.termoNome=file.name;S.ui.errForm="";render()};rd.readAsDataURL(file)}
function onFoto(ev){var file=ev.target.files&&ev.target.files[0],k=+ev.target.dataset.foto;if(!file)return;var rd=new FileReader();rd.onload=function(){var img=new Image();img.onload=function(){var c=document.createElement("canvas"),k=Math.min(1,900/Math.max(img.width,img.height));c.width=img.width*k;c.height=img.height*k;c.getContext("2d").drawImage(img,0,0,c.width,c.height);S.f.itens[k].foto=c.toDataURL("image/jpeg",.8);render()};img.src=rd.result};rd.readAsDataURL(file)}

function go(sc){S.screen=sc;S.sheet=null;S.f={};S.ui.form=null;S.ui.errForm="";S.ui.locId=null;["okReg","okRet","okRes","okUser","okArea","okBloq","okCfg","okLoc","okLocAdm","okEnc","okSol"].forEach(function(k){S.ui[k]=""});}

var A={
 go:function(v){if(v==="_mais"){S.sheet={t:"mais"};return}if(v==="_sair"){A.sair();return}if(v==="locNova"&&!S.lf)S.lf=novoLf();go(v);
  if(S.real&&S.role==="sindico"&&(v==="usuarios"||v==="config"))carregarAdmin().then(function(){if(S.screen==="config"){S.f={};render()}});
  if(S.real&&S.role==="morador"&&v==="perfil")carregarPerfil();
  if(S.real&&S.role==="morador"&&(v==="inicio"||v==="encomendas"||v==="avisos")){carregarMinhasEnc();carregarAvisos()}
  if(S.real&&S.role==="portaria"&&(v==="enc"||v==="fila"))carregarPortaria();
  if(S.real&&((S.role==="morador"&&(v==="inicio"||v==="reservas"))||(S.role==="portaria"&&v==="pres")||(S.role==="sindico"&&["painel","reservas","areas","bloqueios"].indexOf(v)>=0)))carregarReservas();
  if(S.real&&S.role==="sindico"&&v==="encomendas")carregarEncAdm()},
 goMais:function(v){if(S.real&&S.role==="sindico"&&v==="encomendas")setTimeout(carregarEncAdm,0);if(S.real&&S.role==="sindico"&&(v==="usuarios"||v==="config"))setTimeout(function(){carregarAdmin().then(function(){if(S.screen==="config"){S.f={};render()}})},0);go(v)},
 enter:function(v){var p=String(v).split(":"),role=p[0];if(p[1])S.me[role]=+p[1];S.role=role;S.ui={};S.porteiro=null;S.lf=null;S.nr=null;go(role==="morador"?"inicio":role==="portaria"?"enc":"painel")},
 escolhePorteiro:function(v){var pp=user(v);if(S.cfg.exigirPin&&(S.real?pp.temPin:pp.pin)){S.f={pinIn:""};S.ui.errForm="";S.sheet={t:"pin",id:v};return}S.porteiro=v;S.portLast=Date.now();toast("Olá, "+pp.nome.split(" ")[0]+"! O que você registrar fica no seu nome.")},
 trocaPorteiro:function(){S.porteiro=null;S.ui.okReg="";S.ui.okRet="";S.f={};if(S.screen==="pres")S.screen="enc"},
 locNovaBtn:function(){S.lf=novoLf();go("locNova")},
 locListaBtn:function(){go("loc")},
 abrirLoc:function(v){if(S.role==="morador"){go("locDet")}S.ui.locId=+v;window.scrollTo(0,0)},
 locVoltar:function(){S.ui.locId=null},
 filLoc:function(v){S.ui.filLoc=v},
 lfAddP:function(){S.lf.pessoas.push({nome:"",rg:"",cpf:"",doc:null})},
 lfRemP:function(v){S.lf.pessoas.splice(+v,1)},
 lfAddV:function(){S.lf.veiculos.push({placa:"",modelo:"",doc:null})},
 lfRemV:function(v){S.lf.veiculos.splice(+v,1)},
 lfSemCarro:function(){S.lf.semCarro=!S.lf.semCarro},
 lfAceite:function(v,el){S.lf.aceite=el.checked},
 rmDoc:function(v){setPath(v,null)},
 verDoc:function(v){S.sheet={t:"doc",path:v}},
 locEnviar:function(){var F=S.lf,u=me(),min=addDays(TODAY,S.cfg.locAntMin),e="";
  if(!F.de||!F.ate)e="Informe as datas de entrada e saída.";else if(F.de<min)e="A entrada precisa ser a partir de "+fmtD(min)+" ("+S.cfg.locAntMin+" dias de antecedência).";else if(F.ate<=F.de)e="A saída precisa ser depois da entrada.";
  if(!e)F.pessoas.some(function(p,i){var n="Pessoa "+(i+1)+": ";if(p.nome.trim().split(/\s+/).length<2)e=n+"informe o nome completo.";else if(!p.rg.trim())e=n+"informe o RG.";else if(!cpfOk(p.cpf))e=n+"CPF inválido. Confira os números.";else if(!p.doc)e=n+"anexe a foto do documento.";return !!e});
  if(!e&&!F.semCarro)F.veiculos.some(function(v,i){var n="Veículo "+(i+1)+": ";if(!/^[A-Za-z]{3}-?[0-9][A-Za-z0-9][0-9]{2}$/.test(v.placa.trim()))e=n+"placa inválida (ex.: ABC1D23).";else if(!v.doc)e=n+"anexe o documento do carro (CRLV).";return !!e});
  if(!e&&!F.aceite)e="Marque a declaração de responsabilidade para enviar.";
  if(e){S.ui.errForm=e;return}
  S.ui.errForm="";var q=quandoAgora();
  var l={id:uid(),apto:u.apto,por:u.nome,criado:q,de:F.de,ate:F.ate,status:"pendente",plataforma:F.plataforma,contato:F.contato,obs:F.obs,semCarro:F.semCarro,pessoas:F.pessoas.map(function(p){return {nome:p.nome.trim(),rg:p.rg.trim(),cpf:fmtCpf(p.cpf),doc:p.doc}}),veiculos:F.semCarro?[]:F.veiculos.map(function(v){return {placa:v.placa.trim().toUpperCase(),modelo:v.modelo.trim(),doc:v.doc}}),hist:[{q:q,t:"Solicitação enviada por "+u.nome}]};
  S.locacoes.push(l);audit("Pediu autorização de locação","Apto "+u.apto+" · "+periodo(l)+" · "+l.pessoas.length+" hóspede(s)");S.lf=null;go("locDet");S.ui.locId=l.id;toast("Solicitação enviada. A administração vai analisar.")},
 locCorrigir:function(v){var l=loc(+v);S.lf={de:"",ate:"",pessoas:JSON.parse(JSON.stringify(l.pessoas)),veiculos:l.veiculos.length?JSON.parse(JSON.stringify(l.veiculos)):[{placa:"",modelo:"",doc:null}],semCarro:l.semCarro,plataforma:l.plataforma,contato:l.contato,obs:l.obs,aceite:false};S.lf.de=l.de>=addDays(TODAY,S.cfg.locAntMin)?l.de:"";S.lf.ate=S.lf.de?l.ate:"";go("locNova");toast("Dados copiados. Corrija o que foi pedido e envie de novo.")},
 locMotivoM:function(v){S.f={motivo:""};S.sheet={t:"locMotivo",id:+v,acao:"cancelar",quem:"morador"}},
 locRecusar:function(v){S.f={motivo:""};S.sheet={t:"locMotivo",id:+v,acao:"recusar",quem:"adm"}},
 locCancelarA:function(v){S.f={motivo:""};S.sheet={t:"locMotivo",id:+v,acao:"cancelar",quem:"adm"}},
 motivoRapido:function(v){S.f.motivo=v},
 locAprovar:function(v){var l=loc(+v),u=me(),q=quandoAgora(),cargo=u.perfil==="sindico"?"síndico":"administração";l.status="aprovada";l.decisao={por:u.nome,q:q};l.hist.push({q:q,t:"Aprovada por "+u.nome+" ("+cargo+")"});
  notify(l.apto,"Locação de "+periodo(l)+" aprovada pela administração.","loc");audit("Aprovou locação","Apto "+l.apto+" · "+periodo(l));S.ui.okLocAdm="Locação do apto "+l.apto+" aprovada. O morador foi avisado e a portaria já vê os hóspedes.";S.ui.locId=null},
 locConfMotivo:function(){var s=S.sheet,l=loc(s.id),u=me(),q=quandoAgora(),m=(S.f.motivo||"").trim();
  if(s.acao==="recusar"&&!m){S.ui.errForm="Escreva o motivo da recusa. O morador vai ver este texto.";return}
  if(s.acao==="cancelar"&&s.quem==="adm"&&!m){S.ui.errForm="Escreva o motivo do cancelamento. O morador vai ver este texto.";return}
  S.ui.errForm="";l.motivo=m;
  if(s.acao==="recusar"){l.status="recusada";l.decisao={por:u.nome,q:q};l.hist.push({q:q,t:"Recusada por "+u.nome+": "+m});notify(l.apto,"Sua solicitação de locação de "+periodo(l)+" foi recusada. Motivo: "+m,"loc");audit("Recusou locação","Apto "+l.apto+" · "+m);S.ui.okLocAdm="Solicitação do apto "+l.apto+" recusada. O morador recebeu o motivo.";S.ui.locId=null}
  else{l.status="cancelada";l.cancelPor=u.nome;l.hist.push({q:q,t:"Cancelada por "+u.nome+(m?": "+m:"")});
   if(s.quem==="adm"){notify(l.apto,"A autorização de locação de "+periodo(l)+" foi cancelada pela administração. Motivo: "+m,"loc");S.ui.okLocAdm="Autorização do apto "+l.apto+" cancelada. O morador foi avisado.";S.ui.locId=null}
   else toast("Cancelada. A administração e a portaria foram avisadas.");
   audit("Cancelou locação","Apto "+l.apto+" · "+periodo(l)+(m?" · "+m:""))}
  S.sheet=null;S.f={}},
 loginback:function(){S.login.step="email";S.login.err="";S.login.codigo=""},
 reenviarCodigo:function(){pedirCodigo()},
 testarConexao:function(){testarConexao()},
 sair:function(){if(S.real){chamarServidor("sessao.sair",{},{grava:true,silencioso:true}).catch(function(){});sairLocal();return}S.role=null;S.screen=null;S.sheet=null;S.login.step="email"},
 sairTodos:function(){if(S.real){chamarServidor("sessao.sairTodos",{},{grava:true}).then(function(d){sairLocal();toast("Você saiu de todos os aparelhos ("+d.encerradas+"). Para entrar de novo, peça um novo código.");render()},function(e){toast(e.mensagem);render()});return}audit("Saiu de todos os aparelhos",me().nome);A.sair();toast("Você saiu de todos os aparelhos. Para entrar de novo, use um novo código.")},
 pinOk:function(){var pp=user(S.sheet.id);if(S.real){chamarServidor("portaria.conferirPin",{id:pp.id,pin:soDig(S.f.pinIn)},{grava:true}).then(function(){S.sheet=null;S.ui.errForm="";S.f={};S.porteiro=pp.id;S.portLast=Date.now();toast("Olá, "+pp.nome.split(" ")[0]+"! O que você registrar fica no seu nome.");render()},function(e){S.ui.errForm=e.mensagem;S.f.pinIn="";render()});return}if(S.f.pinIn!==pp.pin){S.ui.errForm="PIN incorreto. Tente de novo.";S.f.pinIn="";return}S.sheet=null;S.ui.errForm="";S.f={};S.porteiro=pp.id;S.portLast=Date.now();toast("Olá, "+pp.nome.split(" ")[0]+"! O que você registrar fica no seu nome.")},
 /* pedidos de cadastro */
 cadAbrir:function(){S.cad=novoCad("publico");S.ui.errForm="";S.login.step="cadastro"},
 cdVoltar:function(){S.cad=null;S.ui.errForm="";S.login.step="email"},
 cdVoltarPerfil:function(){S.cad=null;go("perfil");if(S.real)carregarMeusPedidos()},
 cdAndar:function(v){S.cad.andar=+v;S.cad.apto=""},
 cdApto:function(v){S.cad.apto=v},
 cdAdd:function(){if(S.cad.pessoas.length<S.cfg.cadPessoas)S.cad.pessoas.push(novaPessoaCad())},
 cdRem:function(v){S.cad.pessoas.splice(+v,1)},
 cdWa:function(v,el){S.cad.pessoas[+v].wa=el.checked},
 cdSemTel:function(v,el){var p=S.cad.pessoas[+v];p.semTel=el.checked;if(p.semTel){p.tel="";p.wa=false}},
 cdAceite:function(v,el){S.cad.aceite=el.checked},
 cdEnviar:function(){var C=S.cad,e="",vistos={};
  if(C.origem==="publico"&&!aptoPadrao(C.apto))e="Escolha o andar e o apartamento.";
  if(!e)C.pessoas.some(function(p,i){var n="Pessoa "+(i+1)+": ",em=p.email.trim().toLowerCase();if(p.nome.trim().split(/\s+/).length<2)e=n+"informe o nome completo.";else if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em))e=n+"e-mail inválido.";else if(vistos[em])e=n+"o e-mail repete o de outra pessoa. Cada pessoa precisa do próprio e-mail.";else if(!p.semTel&&soDig(p.tel).length<10)e=n+"informe o telefone com DDD ou marque \"Não tenho telefone\".";vistos[em]=1;return !!e});
  if(!e&&!C.aceite)e="Marque a autorização de uso dos dados para enviar.";
  if(e){S.ui.errForm=e;return}
  S.ui.errForm="";
  if(C.origem==="publico"||S.real){var pub=C.origem==="publico",dados={aceite:true,robo:C.robo||"",pessoas:C.pessoas.map(function(p){return {nome:p.nome,email:p.email,telefone:p.semTel?"":p.tel,semTelefone:!!p.semTel,vinculo:p.vinc,whatsapp:!p.semTel&&!!p.wa}})};
   if(pub)dados.unidade=C.apto;
   chamarServidor(pub?"cadastro.solicitar":"cadastro.pedirInclusao",dados,{grava:true}).then(function(d){C.res=d.resultado;if(!pub)carregarMeusPedidos();window.scrollTo(0,0);render()},function(er){S.ui.errForm=er.mensagem;render()});
   return}
  var q=quandoAgora(),ped=uid(),u=C.origem==="morador"?me():null;
  if(C.robo){C.res=C.pessoas.map(function(p){return {nome:p.nome,email:p.email,st:"ok"}});return}
  C.res=C.pessoas.map(function(p,i){var em=p.email.trim();
   if(emailExiste(em))return {nome:p.nome.trim(),email:em,st:"tem"};
   if(emailPendente(em))return {nome:p.nome.trim(),email:em,st:"pend"};
   S.solicitacoes.push({id:ped+i+1,pedido:ped,origem:C.origem,solicitante:u?u.nome:"",apto:aptoNorm(C.apto),criado:q,nome:p.nome.trim(),email:em,tel:p.semTel?"":p.tel.trim(),semTel:!!p.semTel,vinc:p.vinc,wa:!p.semTel&&!!p.wa,status:"pendente"});
   return {nome:p.nome.trim(),email:em,st:"ok"}});
  var n=C.res.filter(function(r){return r.st==="ok"}).length;if(C.origem==="publico")S.cadHoje+=n;
  if(n){if(u)audit("Pediu inclusão de morador","Apto "+u.apto+" · "+n+" pessoa(s)");else S.audit.unshift({q:q,quem:"Tela de entrada (sem login)",acao:"Pedido de cadastro",det:"Apto "+C.apto+" · "+n+" pessoa(s)"})}},
 goSol:function(){go("usuarios");S.ui.usrTab="solicitacoes";S.ui.pedId=null;if(S.real)carregarPedidos()},
 filSol:function(v){S.ui.filSol=v},
 abrirPed:function(v){S.ui.pedId=String(v);S.ui.okSol="";S.ui.solEd={};window.scrollTo(0,0)},
 fechaPed:function(){S.ui.pedId=null;S.ui.okSol=""},
 solAprovar:function(v){var x=solPorId(v);if(S.real){aprovarReal([x]);return}var er=aprovarSol(x);if(er){toast(er);return}S.ui.okSol=x.nome+" aprovado(a). Enviamos o e-mail de boas-vindas para "+x.email+"."},
 solAprovarTodos:function(v){var ok=[],er=[],alvo=S.solicitacoes.filter(function(y){return String(y.pedido)===String(v)&&y.status==="pendente"});if(S.real){aprovarReal(alvo);return}alvo.forEach(function(x){var r=aprovarSol(x);if(r)er.push(r);else ok.push(x.nome)});S.ui.okSol=ok.length?ok.length+(ok.length>1?" pessoas aprovadas: ":" pessoa aprovada: ")+ok.join(", ")+". Os e-mails de boas-vindas foram enviados.":"";if(er.length)toast(er.join(" "))},
 solReprovar:function(v){S.f={motivo:""};S.ui.errForm="";S.sheet={t:"solRep",id:String(v)}},
 solConfRep:function(){var x=solPorId(S.sheet.id),m=(S.f.motivo||"").trim();if(!m){S.ui.errForm="Escreva o motivo. Ele fica só para a administração.";return}
  if(S.real){chamarServidor("cadastro.reprovar",{id:x.id,motivo:m},{grava:true}).then(function(){S.ui.okSol=x.nome+": pedido reprovado. Enviamos e-mail pedindo para procurar a administração.";S.sheet=null;S.f={};S.ui.errForm="";return carregarPedidos()},function(er){S.ui.errForm=er.mensagem;render()});return}
  S.ui.errForm="";x.status="reprovada";x.motivo=m;x.decididoPor=me().nome;x.decididoEm=quandoAgora();
  if(x.origem==="morador")notify(x.apto,"O pedido de inclusão de "+x.nome+" não foi aprovado. Procure a administração.","perfil");
  audit("Reprovou cadastro",x.nome+" · apto "+x.apto+" · "+m);S.ui.okSol=x.nome+": pedido reprovado. Enviamos e-mail pedindo para procurar a administração.";S.sheet=null;S.f={}},
 fechaSheet:function(){S.sheet=null;S.ui.errForm=""},
 scrim:function(v,el,ev){if(ev.target===el)S.sheet=null},
 sheet:function(v){S.sheet={t:v}},
 toastMsg:function(v){S.sheet=null;toast(v)},
 verTermos:function(v){S.sheet={t:"termos",id:v}},
 abrirTermo:function(v){var a=area(v);if(!a||!a.temTermo)return;var u=termoUrl(a);if(u){S.sheet={t:"termoPdf",id:a.id};return}toast("Abrindo o termo…");carregarTermo(a,true)},
 /* morador */
 goInicio:function(){go("inicio")},
 novaRes:function(){go("reservas");S.ui.resTab="nova"},
 minhasRes:function(){go("reservas");S.ui.resTab="minhas"},
 encHist:function(){go("encomendas");S.ui.encTab="ret"},
 encTab:function(v){S.ui.encTab=v},
 resTab:function(v){S.ui.resTab=v},
 abrirRes:function(v){go("reserva");S.ui.resId=String(v)},
 abrirAviso:function(v){var n=S.notifs.filter(function(x){return String(x.id)===String(v)})[0];if(S.real&&!n.lida)chamarServidor("avisos.marcarLido",{id:n.id},{grava:true,silencioso:true}).catch(function(){});n.lida=true;if(n.ir==="perfil"){go("perfil");return}if(n.ir==="encomendas"){go("encomendas");S.ui.encTab="pend"}else A.minhasRes()},
 lerTudo:function(){var u=me();S.notifs.forEach(function(n){if(n.apto===u.apto&&!n.lida){if(S.real)chamarServidor("avisos.marcarLido",{id:n.id},{grava:true,silencioso:true}).catch(function(){});n.lida=true}})},
 verFoto:function(v){var ef=encPorId(v);if(S.real&&ef&&ef.temFoto&&!ef.foto){chamarServidor("encomendas.foto",{id:v}).then(function(d){ef.foto=d.foto;S.sheet={t:"foto",id:v};render()},function(e){toast(e.mensagem);render()});return}S.sheet={t:"foto",id:v}},
 nrArea:function(v){S.nr.area=v;S.nr.data=null;S.nr.turno=null},
 nrMes:function(v){var N=S.nr,m=N.m+ +v,y=N.y;if(m<0){m=11;y--}if(m>11){m=0;y++}var k=y*12+m,h=mesAtual(),k0=S.real?h.y*12+h.m:2026*12+9,mx=S.real?k0+Math.ceil(((area(N.area)||{}).antMax||90)/30):2027*12+0;if(k<k0||k>mx)return;N.m=m;N.y=y},
 nrDia:function(v){var a=area(S.nr.area);if(diaStatus(a,v)!=="livre")return;S.nr.data=v;S.nr.turno=null},
 nrTurno:function(v){S.nr.turno=v},
 nrAceite:function(v,el){S.nr.aceite=el.checked},
 nrConfirmar:function(){var N=S.nr,a=area(N.area),u=me(),turno=a.modo==="integral"?"integral":N.turno;
  if(!N.data||!turno||!N.aceite)return;
  if(S.real){if(S.ui.ocupado)return;S.ui.ocupado=true;
   chamarServidor("reservas.solicitar",{area:a.id,data:N.data,turno:turno,aceite:true},{grava:true}).then(function(d){var r=resDoServidor(d);if(!resPorId(r.id))S.reservas.push(r);S.nr=null;go("reserva");S.ui.resId=String(r.id);
    toast(r.status==="aguardando"?"Pedido enviado. Você será avisado quando a administração responder.":"Reserva confirmada! Agora você pode cadastrar os convidados.");carregarReservas()},
    function(e){toast(e.mensagem);if(e.codigo==="CONFLITO"){N.data=null;N.turno=null;carregarReservas()}render()}).finally(function(){S.ui.ocupado=false});return} if(conflito(a.id,N.data,turno)){toast("Esta data acabou de ser reservada. Escolha outra.");N.data=null;return}
  var r={id:uid(),por:u.nome,area:a.id,data:N.data,turno:turno,apto:u.apto,nome:u.nome,status:a.manual?"aguardando":"confirmada",isenta:false,convidados:[]};
  S.reservas.push(r);audit("Solicitou reserva",a.nome+" · "+fmtD(N.data)+" · "+turnoLabel(a,turno));
  notify(u.apto,a.manual?"Seu pedido de "+a.nome+" em "+fmtD(N.data)+" aguarda aprovação.":"Reserva de "+a.nome+" em "+fmtD(N.data)+" confirmada.","reservas");
  S.nr=null;go("reserva");S.ui.resId=r.id;toast(a.manual?"Pedido enviado. Você será avisado quando a administração responder.":"Reserva confirmada! Agora você pode cadastrar os convidados.")},
 remConv:function(v){var r=resPorId(S.ui.resId);if(S.real){var l=r.convidados.slice();var c=l.splice(+v,1)[0];salvarConvidados(r,l,(c?c.n:"Convidado")+" removido(a) da lista.");return}r.convidados.splice(+v,1)},
 pedirCancel:function(v){S.sheet={t:"cancelRes",id:String(v)}},
 confCancel:function(v){var r=resPorId(v);if(S.real){S.sheet=null;chamarServidor("reservas.cancelar",{id:r.id},{grava:true}).then(function(d){Object.assign(r,resDoServidor(d));toast("Reserva cancelada.")},function(e){toast(e.mensagem);carregarReservas()});return}r.status="cancelada";S.sheet=null;audit("Cancelou reserva",area(r.area).nome+" · "+fmtD(r.data));toast("Reserva cancelada.")},
 editPerfil:function(){var u=me();if(S.ui.editPerfil){if(S.real&&S.f.tel!=null){salvarPerfil({telefone:S.f.tel},"Dados salvos.");S.f={};S.ui.editPerfil=false;return}if(S.f.tel!=null)u.tel=S.f.tel;S.f={};toast("Dados salvos.")}S.ui.editPerfil=!S.ui.editPerfil},
 pedirIncl:function(){S.cad=novoCad("morador",me().apto);go("inclusao")},
 avTog:function(v){if(v==="enc"&&S.real){var nv=me().avEmail===false;salvarPerfil({avisoEmailEncomenda:nv},nv?"Você vai receber e-mail quando chegar encomenda.":"E-mail de encomendas desligado. O aviso no app continua.");return}if(v==="enc"){var u=me();u.avEmail=u.avEmail===false;toast(u.avEmail?"Você vai receber e-mail quando chegar encomenda.":"E-mail de encomendas desligado. O aviso no app continua.");return}S.ui.av[v]=!S.ui.av[v]},
 waOptIn:function(){var u=me();if(!u.tel)return;if(S.real){salvarPerfil({whatsapp:!u.wa},!u.wa?"Pronto: você vai receber avisos de encomenda no WhatsApp.":"Aviso por WhatsApp desligado.");return}u.wa=!u.wa;audit(u.wa?"Autorizou aviso por WhatsApp":"Retirou autorização de WhatsApp","Apto "+u.apto+" · "+u.nome);toast(u.wa?"Pronto: você vai receber avisos de encomenda no WhatsApp.":"Aviso por WhatsApp desligado.")},
 /* portaria */
 pAndar:function(v){S.f.andar=+v;S.f.un=String(+v*100+1);S.ui.okReg=""},
 pApto:function(v){S.f.un=v;S.ui.okReg=""},
 pExtra:function(v){S.f.un=v;S.f.andar=null;S.ui.okReg=""},
 pTipo:function(v){var p=v.split("|");S.f.itens[+p[0]].tipo=p[1]},
 pTiraFoto:function(v){S.f.itens[+v].foto=null},
 pAddItem:function(){S.f.itens.push(novoItem());S.ui.okReg=""},
 pRemItem:function(v){S.f.itens.splice(+v,1)},
 pRegistrar:function(){if(S.real){registrarReal();return}var f=S.f,un=f.un,u=me(),mor=moradoresDe(un),ativos=mor.filter(function(m){return m.sit==="Ativo"}),n=f.itens.length,hora=hhmm(),lote=n>1?uid():null,ids=[],cods=[];
  var aviso=!ativos.length?"invalido":ativos.some(function(m){return m.avEmail!==false})?"email":"app";
  f.itens.forEach(function(it,i){var e={id:uid()+i,apto:un,tipo:it.tipo,rem:(it.rem||"").trim(),data:TODAY,hora:hora,porteiro:u.nome,cod:codigo(),status:"pendente",aviso:aviso,foto:it.foto||null,lote:lote};S.encomendas.push(e);ids.push(e.id);cods.push(e.cod)});
  var desc=f.itens.map(function(it){return it.tipo+(it.rem.trim()?" ("+it.rem.trim()+")":"")}).join(", ");
  notify(un,n>1?n+" encomendas chegaram na portaria: "+desc+".":desc+" chegou na portaria.","encomendas");audit(n>1?"Registrou encomendas":"Registrou encomenda",unLabel(un)+" · "+desc);
  S.ui.lastEnc=ids[0];S.ui.okReg=(n>1?n+" encomendas registradas":"Registrada")+" para "+unLabel(un)+" às "+hora+" (código"+(n>1?"s ":" ")+cods.join(", ")+"). "+(mor.length?"O morador já vê o aviso no app"+(aviso==="email"?" e vai receber um e-mail.":"."):"Unidade sem cadastro: avise por interfone.");
  f.itens=[novoItem()]},
 pRetirada:function(v){S.f={quem:"",outra:""};var e=encPorId(v);var m=moradoresDe(e.apto);if(m.length)S.f.quem=m[0].nome;S.sheet={t:"retirada",id:v};S.ui.okRet=""},
 fQuem:function(v){S.f.quem=v},
 waAbrir:function(v){var e=encPorId(v),ds=waDest(e.apto);Object.assign(S.f,{waDest:ds[0]&&ds[0].id,waMsg:null,waTeste:""});S.ui.waDet=false;S.sheet={t:"wa",id:v,stage:"prev"}},
 waDest:function(v){var e=encPorId(S.sheet.id);S.f.waDest=v;S.f.waMsg=waTexto(e,user(v))},
 waChat:function(){if(!String(S.f.waMsg||"").trim()){toast("A mensagem está vazia.");return}S.sheet.stage="chat"},
 waDet:function(){S.ui.waDet=!S.ui.waDet},
 waEditar:function(){S.sheet.stage="prev"},
 waEnviar:function(){var e=encPorId(S.sheet.id),ds=waDest(e.apto),dest=ds.filter(function(u){return String(u.id)===String(S.f.waDest)})[0]||ds[0];
  if(S.real)chamarServidor("encomendas.registrarWhatsApp",{porteiroId:S.porteiro,id:e.id,para:dest.id},{grava:true,silencioso:true}).then(function(d){mesclarEnc(d.encomendas.map(encDoServidor));render()},function(er){toast(er.mensagem);render()});
  S.sheet.sent=true;S.sheet.hora=hhmm();loteDe(e).forEach(function(x){x.waEm="Hoje "+S.sheet.hora+" · para "+dest.nome.split(" ")[0]});audit("Avisou no WhatsApp","Apto "+e.apto+" · "+e.tipo+" · para "+dest.nome)},
 waVoltar:function(){S.sheet=null;delete S.f.waDest;delete S.f.waMsg;delete S.f.waTeste;toast("Aviso por WhatsApp registrado.")},
 pConfRet:function(){if(!S.f.quem||(S.f.quem==="__outra"&&!(S.f.outra||"").trim())){S.ui.errForm="Informe quem está retirando.";return}S.ui.errForm="";var e=encPorId(S.sheet.id),f=S.f,quem=f.quem==="__outra"?f.outra.trim():f.quem,u=me();
  if(S.real){if(S.ui.ocupado)return;S.ui.ocupado=true;chamarServidor("encomendas.retirar",{porteiroId:S.porteiro,id:e.id,retiradaPor:quem},{grava:true}).then(function(d){var x=encDoServidor(d);mesclarEnc([x]);S.sheet=null;S.f={};S.portLast=Date.now();S.ui.okRet="Retirada do apto "+x.apto+" registrada às "+d.retiradaHora+" (retirado por "+quem+").";render()},function(er){S.ui.errForm=er.mensagem;render()}).finally(function(){S.ui.ocupado=false});return}
  e.status="retirada";e.por=quem;e.em="Hoje "+hhmm();e.entregue=u.nome;S.sheet=null;
  audit("Registrou retirada","Apto "+e.apto+" · "+e.tipo+" · retirado por "+quem);
  S.ui.okRet="Retirada do apto "+e.apto+" registrada às "+hhmm()+" (retirado por "+quem+").";S.f={}},
 pOpenRes:function(v){S.ui.openRes=String(S.ui.openRes)===String(v)?null:String(v)},
 /* síndico */
 sAprovar:function(v){var r=resPorId(v);if(S.real){chamarServidor("reservas.decidir",{id:r.id,aprovar:true},{grava:true}).then(function(d){Object.assign(r,resDoServidor(d));toast("Reserva do apto "+r.apto+" aprovada. O morador foi avisado.")},function(e){toast(e.mensagem);carregarReservas()});return}r.status="confirmada";audit("Aprovou reserva",area(r.area).nome+" · apto "+r.apto+" · "+fmtD(r.data));notify(r.apto,"Sua reserva de "+area(r.area).nome+" em "+fmtD(r.data)+" foi aprovada.","reservas");toast("Reserva do apto "+r.apto+" aprovada. O morador foi avisado.")},
 sRecusar:function(v){var r=resPorId(v);if(S.real){chamarServidor("reservas.decidir",{id:r.id,aprovar:false},{grava:true}).then(function(d){Object.assign(r,resDoServidor(d));toast("Reserva do apto "+r.apto+" recusada. O morador foi avisado.")},function(e){toast(e.mensagem);carregarReservas()});return}r.status="recusada";audit("Recusou reserva",area(r.area).nome+" · apto "+r.apto+" · "+fmtD(r.data));notify(r.apto,"Sua reserva de "+area(r.area).nome+" em "+fmtD(r.data)+" foi recusada.","reservas");toast("Reserva do apto "+r.apto+" recusada. O morador foi avisado.")},
 sCancelar:function(v){var r=resPorId(v);if(S.real){chamarServidor("reservas.cancelar",{id:r.id,motivo:"Cancelada pela administração"},{grava:true}).then(function(d){Object.assign(r,resDoServidor(d));toast("Reserva do apto "+r.apto+" cancelada. O morador foi avisado.")},function(e){toast(e.mensagem);carregarReservas()});return}r.status="cancelada";audit("Cancelou reserva (administração)",area(r.area).nome+" · apto "+r.apto+" · "+fmtD(r.data));notify(r.apto,"Sua reserva de "+area(r.area).nome+" em "+fmtD(r.data)+" foi cancelada pela administração.","reservas");toast("Reserva do apto "+r.apto+" cancelada. O morador foi avisado.")},
 sReenviar:function(){var n=0;S.encomendas.forEach(function(e){if(e.status==="pendente"&&e.aviso==="cota"){e.aviso="email";n++}});audit("Reenviou avisos",n+" e-mail(s) reenviado(s)");toast(n?n+" e-mail reenviado. E-mails inválidos precisam de correção no cadastro.":"Os e-mails restantes são inválidos: corrija o cadastro do morador.")},
 sNovaRes:function(){go("reservas");S.ui.form="novaRes";S.f=S.real?{apto:"",orig:"Telefone",mor:"",area:areaPadrao(),data:"",cy:mesAtual().y,cm:mesAtual().m,turno:null,isenta:false,termos:false}:{apto:"807",orig:"Telefone",mor:"",area:"churras",data:"",cy:2026,cm:9,turno:null,isenta:false,termos:true};if(S.real)carregarReservas()},
 sVerCal:function(){go("reservas");S.ui.form="cal";S.f=S.real?{area:areaPadrao(),cy:mesAtual().y,cm:mesAtual().m,data:null}:{area:"churras",cy:2026,cm:9,data:null};if(S.real)carregarReservas()},
 fMes:function(v){mudaMes(S.f,v)},
 fDia:function(v){if(diaStatus(area(S.f.area),v,null,true)!=="livre")return;S.f.data=v;S.f.turno=null},
 calDia:function(v){S.f.data=S.f.data===v?null:v},
 calIncluir:function(){var d=S.f.data,ar=S.f.area;A.sNovaRes();S.f.data=d;S.f.area=ar;S.f.cy=+d.slice(0,4);S.f.cm=+d.slice(5,7)-1},
 uAndar:function(v){S.ui.uAndar=+v},
 sNovaExtra:function(){S.ui.form="extra";S.ui.okExtra="";S.ui.errForm="";S.f={num:"",nome:"",tipo:"residencial",local:"",encomendas:true,reservas:true,ativo:true}},
 sEditExtra:function(v){var e=unExtra(v);window.scrollTo(0,0);S.ui.form="extra:"+e.num;S.ui.okExtra="";S.ui.errForm="";S.f=JSON.parse(JSON.stringify(e))},
 fxTipo:function(v){S.f.tipo=v;if(v==="condominio")S.f.reservas=false},
 fxTog:function(v){S.f[v]=!S.f[v]},
 sSalvaExtra:function(){var f=S.f,ed=S.ui.form!=="extra",num=String(f.num||"").trim().toUpperCase();
  if(!ed){if(!/^[A-Z0-9-]{2,8}$/.test(num)){S.ui.errForm="A identificação deve ter de 2 a 8 letras ou números (ex.: COB).";return}if(unExtra(num)||aptoPadrao(num)){S.ui.errForm="Já existe uma unidade com a identificação "+num+".";return}}
  if(!String(f.nome||"").trim()){S.ui.errForm="Informe o nome da unidade.";return}
  S.ui.errForm="";var o={num:ed?S.ui.form.slice(6):num,nome:f.nome.trim(),tipo:f.tipo,local:(f.local||"").trim(),encomendas:!!f.encomendas,reservas:!!f.reservas,ativo:!!f.ativo};
  if(S.real){chamarServidor("unidades.salvarExtra",{novo:!ed,unidade:o.num,nome:o.nome,tipo:o.tipo,local:o.local,recebeEncomendas:o.encomendas,podeReservar:o.reservas,ativa:o.ativo},{grava:true}).then(function(d){S.ui.okExtra=o.nome+" ("+o.num+") salva."+(o.encomendas&&o.ativo?" Já aparece na tela da portaria.":"")+(!o.ativo&&d.moradores?" Atenção: "+d.moradores+" morador(es) continuam cadastrados nela.":"");S.ui.form=null;S.f={};return carregarAdmin()},function(e){S.ui.errForm=e.mensagem;render()});return}
  if(ed){Object.assign(unExtra(o.num),o);audit("Alterou unidade fora do padrão",o.nome+" ("+o.num+")")}else{S.extras.push(o);audit("Cadastrou unidade fora do padrão",o.nome+" ("+o.num+")")}
  S.ui.okExtra=o.nome+" ("+o.num+") salva. "+(o.encomendas?"Já aparece na tela da portaria.":"");S.ui.form=null;S.f={}},
 sFechaForm:function(){S.ui.form=null;S.f={};S.ui.errForm=""},
 fArea:function(v){S.f.area=v;S.f.turno=null},
 fTurno:function(v){S.f.turno=v},
 fIsenta:function(v,el){S.f.isenta=el.checked},
 fTermos:function(v,el){S.f.termos=el.checked},
 sSalvaRes:function(){var f=S.f,a=area(f.area),turno=a.modo==="integral"?"integral":f.turno;if(!aptoValido(f.apto)||!f.data||!turno||conflito(a.id,f.data,turno))return;
  var mor=moradoresDe(f.apto),nome=f.mor&&f.mor!=="Sem morador cadastrado"?f.mor:(mor[0]?mor[0].nome:"Sem morador cadastrado"),apto=aptoNorm(f.apto);
  if(S.real){if(S.ui.ocupado)return;S.ui.ocupado=true;
   chamarServidor("reservas.incluir",{area:a.id,data:f.data,turno:turno,unidade:apto,responsavel:nome,origem:f.orig,isenta:!!f.isenta},{grava:true}).then(function(d){var r=resDoServidor(d);if(!resPorId(r.id))S.reservas.push(r);
    S.ui.form=null;S.f={};S.ui.filRes="todas";S.ui.okRes="Reserva incluída para o apto "+apto+" ("+a.nome+", "+fmtD(r.data)+"). O apartamento foi avisado no app e por e-mail.";render()},
    function(e){toast(e.mensagem);if(e.codigo==="CONFLITO")carregarReservas();render()}).finally(function(){S.ui.ocupado=false});return}
  var r={id:uid(),por:"Administração",area:a.id,data:f.data,turno:turno,apto:apto,nome:nome,status:"confirmada",isenta:!!f.isenta,convidados:[],origem:"Incluída pela administração ("+f.orig.toLowerCase()+") · "+me().nome.split(" ")[0]};
  S.reservas.push(r);audit("Incluiu reserva",a.nome+" · apto "+apto+" · "+fmtD(f.data)+" · pedido por "+f.orig.toLowerCase());notify(apto,"A administração incluiu sua reserva de "+a.nome+" em "+fmtD(f.data)+".","reservas");
  S.ui.form=null;S.f={};S.ui.filRes="todas";S.ui.okRes="Reserva incluída para o apto "+apto+" ("+a.nome+", "+fmtD(f.data)+"). O morador recebeu a confirmação."},
 filRes:function(v){S.ui.filRes=v},
 usrTab:function(v){S.ui.usrTab=v;S.ui.pedId=null;S.ui.okSol="";if(v==="solicitacoes"&&S.real)carregarPedidos()},
 sNovoUser:function(){S.ui.form="novoUser";S.ui.okUser="";S.f={perfil:S.ui.usrTab==="equipe"?"porteiro":"morador",nome:"",email:"",tel:"",apto:"",vinculo:"Proprietário(a)",turno:"Manhã (06h–14h)",mandato:"2027-12-31",sit:"Ativo"}},
 sEditUser:function(v){var u=user(v);S.ui.form="u:"+u.id;S.ui.okUser="";S.f=Object.assign({vinculo:"Proprietário(a)",turno:"Manhã (06h–14h)",mandato:"2027-12-31"},JSON.parse(JSON.stringify(u)));window.scrollTo(0,0)},
 fPerfil:function(v){S.f.perfil=v},
 fWa:function(v,el){S.f.wa=el.checked},
 fRemPin:function(v,el){S.f.removerPin=el.checked;if(el.checked)S.f.pin=""},
 fAtivo:function(){S.f.sit=S.f.sit==="Desativado"?"Ativo":"Desativado"},
 sSalvaUser:function(){var f=S.f;if(!f.nome.trim()){S.ui.errForm="Informe o nome completo.";return}if(f.perfil!=="porteiro"&&!/\S+@\S+\.\S+/.test(f.email)){S.ui.errForm="Informe um e-mail válido.";return}if(f.perfil==="morador"&&!aptoValido(f.apto)){S.ui.errForm="Informe um apartamento existente (ex.: 807).";return}if(f.perfil==="porteiro"&&f.pin&&!/^\d{4}$/.test(f.pin)){S.ui.errForm="O PIN precisa ter 4 números.";return}S.ui.errForm="";var ed=String(S.ui.form||"").indexOf("u:")===0;
  if(S.real){var dados={id:ed?f.id:undefined,perfil:f.perfil,nome:f.nome,email:f.email||"",telefone:f.tel||"",unidade:f.apto||"",vinculo:f.vinculo,turno:f.turno,mandatoAte:f.mandato||"",pin:f.pin||"",removerPin:!!f.removerPin,ativo:f.sit!=="Desativado",avisoEmailEncomenda:f.avEmail!==false,whatsapp:!!f.wa};
   chamarServidor("usuarios.salvar",dados,{grava:true}).then(function(d){var u=d.usuario;S.ui.okUser=ed?"Cadastro de "+u.nome+" atualizado."+(u.situacao==="Desativado"?" O acesso foi cortado.":""):u.perfil==="porteiro"?u.nome+" cadastrado(a) como porteiro. O nome já aparece no celular da portaria.":u.nome+" cadastrado(a). "+msgBoasVindas(d.email_boasvindas,u.email);S.ui.usrTab=u.perfil==="morador"?"moradores":"equipe";S.ui.form=null;S.f={};window.scrollTo(0,0);return carregarAdmin()},function(e){S.ui.errForm=e.mensagem;render()});return}
  var o={nome:f.nome.trim(),email:f.perfil==="porteiro"?"":f.email.trim(),tel:f.tel||"",wa:f.perfil==="morador"&&!!f.wa&&!!soDig(f.tel),perfil:f.perfil,apto:f.perfil==="morador"?aptoNorm(f.apto):"",vinculo:f.perfil==="morador"?f.vinculo:undefined,turno:f.perfil==="porteiro"?f.turno:undefined,mandato:f.perfil==="sindico"?f.mandato:undefined,pin:f.perfil==="porteiro"?(f.pin||""):undefined,avEmail:f.perfil==="morador"?f.avEmail!==false:undefined};
  if(ed){var u=user(S.ui.form.slice(2));Object.assign(u,o,{sit:f.sit==="Desativado"?"Desativado":(u.sit==="Desativado"?"Ativo":u.sit)});audit("Alterou usuário",o.nome+" · "+PERFIS[o.perfil][0]+(u.sit==="Desativado"?" · acesso desativado":""));S.ui.okUser="Cadastro de "+o.nome+" atualizado."}
  else{S.usuarios.push(Object.assign({id:uid(),sit:o.perfil==="porteiro"?"Ativo":"Convite pendente"},o));audit("Cadastrou usuário",o.nome+" · "+PERFIS[o.perfil][0]+(o.apto?" · apto "+o.apto:""));S.ui.okUser=o.perfil==="porteiro"?o.nome+" cadastrado(a) como porteiro. O nome já aparece no celular da portaria.":o.nome+" cadastrado(a) como "+PERFIS[o.perfil][0]+". O convite foi enviado para "+o.email+"."}
  S.ui.usrTab=o.perfil==="morador"?"moradores":"equipe";S.ui.form=null;S.f={}},
 sEncTab:function(v){S.ui.sEncTab=v;S.ui.okEnc=""},
 encEditar:function(v){var e=encPorId(v);S.f={apto:e.apto,tipo:e.tipo,rem:e.rem};S.ui.errForm="";S.sheet={t:"encEdit",id:v}},
 eeTipo:function(v){S.f.tipo=v},
 encSalvar:function(){var e=encPorId(S.sheet.id),f=S.f;if(!aptoValido(f.apto)){S.ui.errForm="Unidade inexistente. Use o número (ex.: 807) ou a identificação (ex.: COB).";return}
  if(S.real){chamarServidor("encomendas.editar",{id:e.id,unidade:f.apto,tipo:f.tipo,remetente:f.rem||""},{grava:true}).then(function(d){var x=encDoServidor(d.encomenda);mesclarEnc([x]);S.ui.okEnc="Encomenda alterada."+(d.unidadeAvisada?" O apto "+x.apto+" foi avisado.":"");S.sheet=null;S.f={};S.ui.errForm="";render()},function(er){S.ui.errForm=er.mensagem;render()});return}
  S.ui.errForm="";var antes="apto "+e.apto+" · "+e.tipo+(e.rem?" · "+e.rem:""),novo=aptoNorm(f.apto),mudou=novo!==e.apto;e.apto=novo;e.tipo=f.tipo;e.rem=(f.rem||"").trim();e.editEm=quandoAgora();e.editPor=me().nome;
  if(mudou&&e.status==="pendente")notify(novo,e.tipo+(e.rem?" ("+e.rem+")":"")+" chegou na portaria.","encomendas");
  audit("Alterou encomenda","Antes: "+antes+" · agora: apto "+e.apto+" · "+e.tipo+(e.rem?" · "+e.rem:""));S.ui.okEnc="Encomenda alterada."+(mudou?" O apto "+novo+" foi avisado.":"");S.sheet=null;S.f={}},
 encExcluir:function(v){S.f={motivo:""};S.ui.errForm="";S.sheet={t:"encExcluir",id:v}},
 encConfExcluir:function(){var e=encPorId(S.sheet.id),m=(S.f.motivo||"").trim();if(!m){S.ui.errForm="Informe o motivo. Ele fica registrado na auditoria.";return}
  if(S.real){chamarServidor("encomendas.excluir",{id:e.id,motivo:m},{grava:true}).then(function(d){var x=encDoServidor(d.encomenda);mesclarEnc([x]);S.ui.okEnc="Encomenda do apto "+x.apto+" excluída"+(d.fotoApagada?" e foto apagada":"")+".";S.sheet=null;S.f={};S.ui.errForm="";render()},function(er){S.ui.errForm=er.mensagem;render()});return}
  S.ui.errForm="";var tf=!!e.foto;e.status="excluida";e.excMotivo=m;e.excPor=me().nome;e.excEm=quandoAgora();e.foto=null;
  audit("Excluiu encomenda","Apto "+e.apto+" · "+e.tipo+" · motivo: "+m+(tf?" · foto apagada":""));S.ui.okEnc="Encomenda do apto "+e.apto+" excluída"+(tf?" e foto apagada":"")+".";S.sheet=null;S.f={}},
 fAvEmail:function(){S.f.avEmail=S.f.avEmail===false},
 sGerarCod:function(v){if(S.real){chamarServidor("usuarios.gerarCodigo",{id:v},{grava:true}).then(function(d){S.sheet={t:"codigo",id:v,cod:d.codigo};render()},function(e){toast(e.mensagem);render()});return}var u=user(v),c="";for(var i=0;i<6;i++)c+=Math.floor(Math.random()*10);S.sheet={t:"codigo",id:v,cod:c};audit("Gerou código de acesso",u.nome+" · válido por "+S.cfg.codigoMin+" min")},
 sExcluirDados:function(v){S.sheet={t:"excluir",id:v}},
 sConfExcluir:function(){var u=user(S.sheet.id),ap=u.apto;if(S.real){chamarServidor("usuarios.excluirDados",{id:u.id},{grava:true}).then(function(){S.sheet=null;S.ui.form=null;S.f={};S.ui.okUser="Dados pessoais apagados. O acesso foi encerrado.";return carregarAdmin()},function(e){toast(e.mensagem);render()});return}u.nome="Morador excluído";u.email="";u.tel="";u.wa=false;u.sit="Excluído";audit("Excluiu dados pessoais","Apto "+ap+" · dados apagados a pedido (LGPD)");S.sheet=null;S.ui.form=null;S.f={};S.ui.okUser="Dados pessoais apagados. O acesso foi encerrado."},
 fPin:function(){S.f.exigirPin=!S.f.exigirPin},
 fTogCfg:function(v){S.f[v]=!S.f[v]},
 sToggleManual:function(v){var a=area(v);if(S.real){chamarServidor("areas.aprovacao",{id:a.id,manual:!a.manual},{grava:true}).then(function(d){Object.assign(a,d);toast(a.nome+": aprovação "+(a.manual?"manual ligada. Novos pedidos aguardam aprovação.":"automática. Pedidos confirmam na hora."))},function(e){toast(e.mensagem);render()});return}a.manual=!a.manual;audit("Alterou área comum",a.nome+" · aprovação "+(a.manual?"manual":"automática"));toast(a.nome+": aprovação "+(a.manual?"manual ligada. Novos pedidos aguardam aprovação.":"automática. Pedidos confirmam na hora."))},
 sNovaArea:function(){S.ui.form="novaArea";S.ui.okArea="";S.f={nome:"",cap:"30",preco:"100",modo:"integral",abre:"10:00",fecha:"23:00",turnos:[{nome:"Manhã",ini:"09:00",fim:"13:00"},{nome:"Tarde",ini:"14:00",fim:"18:00"}],manual:false,antMin:2,antMax:90,canc:48,limite:0,termos:REGRAS_PADRAO,exigeTermo:false,ativo:true}},
 sEditArea:function(v){var a=area(v);S.ui.form="area:"+v;S.ui.okArea="";S.f=JSON.parse(JSON.stringify(a));S.f.cap=String(a.cap);S.f.preco=String(a.preco);if(S.f.antMax==null)S.f.antMax=90;if(S.f.limite==null)S.f.limite=0;if(!S.f.turnos.length)S.f.turnos=S.real?[{nome:"Manhã",ini:"09:00",fim:"13:00"},{nome:"Tarde",ini:"14:00",fim:"18:00"}]:[{id:"t1",nome:"Almoço",ini:"11:00",fim:"16:00"},{id:"t2",nome:"Noite",ini:"18:00",fim:"23:00"}];window.scrollTo(0,0)},
 fModo:function(v){S.f.modo=v},
 fExigeTermo:function(v){S.f.exigeTermo=v==="1";S.ui.errForm=""},
 fAddTurno:function(){S.f.turnos.push({nome:"Novo turno",ini:"",fim:""})},
 fRemTurno:function(v){S.f.turnos.splice(+v,1)},
 fManual:function(){S.f.manual=!S.f.manual},
 fAtivoArea:function(){S.f.ativo=!S.f.ativo},
 sSalvaArea:function(){if(!S.f.nome.trim()){S.ui.errForm="Informe o nome do espaço.";return}S.ui.errForm="";
  if(S.real&&S.f.exigeTermo&&!S.f.temTermo&&!S.f.termoPdf){S.ui.errForm="Anexe o termo de uso em PDF ou marque que o espaço não exige termo.";return}
  if(S.real){var f0=S.f,ed=S.ui.form!=="novaArea",orig=ed?area(S.ui.form.slice(5)):null,ids=orig?orig.turnos.map(function(t){return String(t.id)}):[];
   var dados={id:ed?orig.id:"",nome:f0.nome.trim(),cap:f0.cap,preco:f0.preco,modo:f0.modo,abre:f0.abre,fecha:f0.fecha,manual:!!f0.manual,antMin:f0.antMin,antMax:f0.antMax,canc:f0.canc,limite:f0.limite,termos:f0.termos,ativo:!!f0.ativo,exigeTermo:!!f0.exigeTermo,termoPdf:f0.exigeTermo&&f0.termoPdf?f0.termoPdf:"",
    turnos:f0.modo==="turnos"?f0.turnos.map(function(t){return {id:ids.indexOf(String(t.id))>=0?t.id:"",nome:t.nome,ini:t.ini,fim:t.fim}}):[]};
   if(S.ui.ocupado)return;S.ui.ocupado=true;
   chamarServidor("areas.salvar",dados,{grava:true}).then(function(d){var x=area(d.id);if(x)Object.assign(x,d);else S.areas.push(d);S.ui.okArea=d.nome+" salvo."+(dados.termoPdf?" Termo de uso anexado (versão de "+d.termoVersao+").":"");S.ui.form=null;S.f={};render()},function(e){S.ui.errForm=e.mensagem;render()}).finally(function(){S.ui.ocupado=false});return}var f=S.f,o={nome:f.nome.trim(),cap:parseInt(f.cap,10)||0,preco:parseFloat(String(f.preco).replace(",","."))||0,modo:f.modo,abre:f.abre,fecha:f.fecha,turnos:f.turnos.map(function(t,i){return {id:t.id||"t"+(i+1)+uid(),nome:t.nome,ini:t.ini,fim:t.fim}}),manual:f.manual,antMin:parseInt(f.antMin,10)||0,canc:parseInt(f.canc,10)||0,termos:f.termos,ativo:f.ativo};
  if(S.ui.form==="novaArea"){o.id="a"+uid();o.antMax=90;S.areas.push(o);audit("Criou área comum",o.nome)}else{Object.assign(area(S.ui.form.slice(5)),o);audit("Alterou área comum",o.nome+" · "+(o.modo==="integral"?"período integral":"por turnos"))}
  S.ui.okArea=o.nome+" salvo.";S.ui.form=null;S.f={}},
 sNovoBloq:function(){S.ui.form="bloq";S.ui.okBloq="";S.f=S.real?{area:"todas",de:TODAY,ate:TODAY,motivo:""}:{area:"todas",de:"2026-12-24",ate:"2026-12-25",motivo:"Confraternização de fim de ano do condomínio"}},
 sSalvaBloq:function(){var f=S.f;if(!f.de||!f.ate||f.ate<f.de){S.ui.errForm="A data final precisa ser igual ou depois da inicial.";return}if(!f.motivo.trim()){S.ui.errForm="Informe o motivo do bloqueio.";return}S.ui.errForm="";
  if(S.real){if(S.ui.ocupado)return;S.ui.ocupado=true;chamarServidor("bloqueios.salvar",{area:f.area,de:f.de,ate:f.ate,motivo:f.motivo.trim()},{grava:true}).then(function(d){S.bloqueios.push(d.bloqueio);var n=d.afetadas.length;
    S.ui.okBloq="Bloqueio criado. As datas já aparecem bloqueadas para os moradores."+(n?" Atenção: já existe"+(n>1?"m "+n+" reservas":" 1 reserva")+" nesse período (apto "+d.afetadas.map(function(x){return x.apto+" em "+fmtD(x.data)}).join(", ")+"). Elas continuam valendo: fale com o morador ou cancele em Reservas.":"");S.ui.form=null;S.f={};render()},
    function(e){S.ui.errForm=e.mensagem;render()}).finally(function(){S.ui.ocupado=false});return}
  S.bloqueios.push({id:uid(),area:f.area,de:f.de,ate:f.ate,motivo:f.motivo.trim(),autor:me().nome});audit("Criou bloqueio",(f.area==="todas"?"Todos os espaços":area(f.area).nome)+" · "+fmtD(f.de)+" a "+fmtD(f.ate));S.ui.okBloq="Bloqueio criado. As datas já aparecem bloqueadas para os moradores.";S.ui.form=null;S.f={}},
 sRemBloq:function(v){if(S.real){chamarServidor("bloqueios.remover",{id:v},{grava:true}).then(function(){S.bloqueios=S.bloqueios.filter(function(x){return String(x.id)!==String(v)});toast("Bloqueio removido.")},function(e){toast(e.mensagem);render()});return}var b=S.bloqueios.filter(function(x){return x.id===+v})[0];S.bloqueios=S.bloqueios.filter(function(x){return x.id!==+v});audit("Removeu bloqueio",b.motivo);toast("Bloqueio removido.")},
 fWaAtivo:function(){S.f.waAtivo=!S.f.waAtivo},
 sSalvaCfg:function(){var f=S.f,tot=parseInt(f.cota,10),res=parseInt(f.emailReserva,10);if(!(tot>0&&tot<=100)||!(res>0&&res<tot)){S.ui.okCfg="";S.ui.errCfg="Confira os e-mails por dia: total de 1 a 100 e códigos menor que o total.";return}S.ui.errCfg="";
  if(S.real){var val={};CFGMAP.forEach(function(m){var v=f[m[0]];if(v===undefined)return;val[m[1]]=typeof S.cfg[m[0]]==="number"?parseInt(v,10):typeof S.cfg[m[0]]==="boolean"?!!v:String(v)});
   chamarServidor("config.salvar",{valores:val},{grava:true}).then(function(d){var u=d.unidades;S.ui.okCfg=d.alteradas?"Configurações salvas ("+d.alteradas+" alteração"+(d.alteradas>1?"ões":"")+")."+(u&&(u.novas||u.inativadas)?" Unidades: "+u.novas+" novas, "+u.inativadas+" inativadas.":""):"Nada mudou.";aplicarConfig(d.config);S.f={};render()},function(e){S.ui.okCfg="";S.ui.errCfg=e.mensagem;render()});return}
  ["andares","porLado","cota","lembrete","codigoMin","codigoTent","sesMorador","sesPortaria","sesAdm","portRelogin","locAntMin","locDocsDias","fotoDias","bkpDias","cadDia","cadPessoas","emailReserva"].forEach(function(k){var n=parseInt(f[k],10);if(n>0)S.cfg[k]=n});S.cfg.nome=f.nome;S.cfg.porAndar=S.cfg.porLado*2;if(/\S+@\S+/.test(f.portariaEmail||""))S.cfg.portariaEmail=f.portariaEmail.trim().toLowerCase();S.cfg.waAtivo=!!f.waAtivo;S.cfg.exigirPin=!!f.exigirPin;S.cfg.locSoProp=!!f.locSoProp;S.cfg.inclSoTitular=!!f.inclSoTitular;S.cfg.waNumero=f.waNumero;if(String(f.waModelo).trim())S.cfg.waModelo=f.waModelo;audit("Alterou configurações",S.cfg.andares+" andares · "+S.cfg.porLado+" aptos por lado (A e B)");S.ui.okCfg="Configurações salvas.";S.f={}}
};

document.addEventListener("click",function(ev){
 var el=ev.target.closest("[data-a]");if(!el)return;var a=el.dataset.a;if(!A[a])return;
 if(a==="scrim"&&ev.target!==el)return;
 if(el.tagName==="A")ev.preventDefault();
 if(el.getAttribute("aria-disabled")==="true")return;
 if(el.type==="checkbox"){A[a](el.dataset.v,el,ev);render();return}
 ev.preventDefault();if(S.role==="portaria"&&S.porteiro)S.portLast=Date.now();A[a](el.dataset.v,el,ev);render();
});
document.addEventListener("submit",function(ev){
 ev.preventDefault();var k=ev.target.dataset.form;
 if(k==="sendcode"){pedirCodigo();return}
 else if(k==="checkcode"){entrarComCodigo();return}
 else if(k==="addConv"){var f=S.f,r=resPorId(S.ui.resId),n=(f.cn||"").trim();if(!n){toast("Digite o nome do convidado.");render();return}
  if(r.convidados.length>=area(r.area).cap){toast("Lista cheia: limite de "+area(r.area).cap+" pessoas.");render();return}
  if(S.real){salvarConvidados(r,r.convidados.concat([{n:n,d:(f.cd||"").trim()}]),n+" adicionado(a) à lista.",true);return}
  r.convidados.push({n:n,d:(f.cd||"").trim()});S.f={};toast(n+" adicionado(a) à lista.")}
 render();
});
document.addEventListener("input",function(ev){var t=ev.target,b=t.dataset&&t.dataset.bind;if(!b)return;setPath(b,t.value);
 if(t.dataset.filter){var q=t.value.toLowerCase().trim(),n=0;document.querySelectorAll("[data-s]").forEach(function(el){var ok=!q||el.dataset.s.indexOf(q)>=0;el.hidden=!ok;if(ok)n++});var no=document.querySelector('[data-none="'+t.dataset.filter+'"]');if(no)no.hidden=n>0;return}
 if(t.dataset.live)render()});
document.addEventListener("change",function(ev){var t=ev.target;if(t.dataset&&t.dataset.bind){setPath(t.dataset.bind,t.value);if(t.dataset.rerender||t.tagName==="SELECT")render()}});
document.addEventListener("keydown",function(ev){if(ev.key==="Escape"&&S.sheet){S.sheet=null;render()}});
/* ================= LIGAÇÃO COM O SERVIDOR (Etapa 4) ================= */
function descricaoAparelho(){var u=navigator.userAgent||"",so=/iPhone|iPad|iPod/.test(u)?"iPhone/iPad":/Android/.test(u)?"Android":/Windows/.test(u)?"Windows":/Mac/.test(u)?"Mac":"Outro",nav=/Edg\//.test(u)?"Edge":/CriOS|Chrome\//.test(u)?"Chrome":/Firefox|FxiOS/.test(u)?"Firefox":/Safari\//.test(u)?"Safari":"navegador";return so+" · "+nav+(window.matchMedia&&matchMedia("(display-mode: standalone)").matches?" · app instalado":"")}
function pedirCodigo(){var L=S.login,em=String(L.email||"").trim().toLowerCase();L.err="";
 if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)){L.err="Digite um e-mail válido.";render();return}
 L.email=em;render();
 chamarServidor("acesso.pedirCodigo",{email:em},{grava:true}).then(function(){var nova=L.step==="code";L.step="code";L.codigo="";L.err="";render();if(nova)toast("Enviamos um novo código, se o e-mail estiver cadastrado.");setTimeout(function(){var i=document.getElementById("lg-codigo");if(i)i.focus()},50)},function(e){L.err=e.mensagem;render()})}
function entrarComCodigo(){var L=S.login,cod=soDig(L.codigo);L.err="";
 if(cod.length!==6){L.err="Digite os 6 números do código.";render();return}
 chamarServidor("acesso.entrar",{email:L.email,codigo:cod,aparelho:descricaoAparelho()},{grava:true}).then(function(d){salvarToken(d.token);entrarReal(d);toast("Olá, "+String(d.nome||"").split(" ")[0]+"! Você entrou no app.")},function(e){L.err=e.mensagem;if(e.codigo==="CODIGO_BLOQUEADO")L.codigo="";render()})}
function entrarReal(eu){
 var perf=eu.perfil,role=perf==="morador"?"morador":perf==="portaria"?"portaria":"sindico";
 S.real=eu;S.usuarios=S.usuarios.filter(function(u){return u.id!=="real"});
 if(role!=="portaria"){S.usuarios.push({id:"real",apto:eu.unidade||"",nome:eu.nome,email:eu.email||"",tel:"",wa:false,perfil:perf,vinculo:eu.vinculo||"",sit:"Ativo",avEmail:true});S.me[role]="real"}
 S.role=role;S.ui={};S.porteiro=null;S.lf=null;S.nr=null;S.cad=null;S.login={step:"email",email:"",codigo:"",err:""};
 go(role==="morador"?"inicio":role==="portaria"?"enc":"painel");
 TODAY=hojeLocal();
 if(role==="sindico"){S.solicitacoes=[];S.srvMor={};S.encomendas=[];carregarPedidos();carregarAdmin();carregarEncAdm()}
 if(role==="morador"){S.meusPedidos=[];S.perfilSrv=null;S.encomendas=[];S.notifs=[];carregarMeusPedidos();carregarPerfil();carregarMinhasEnc();carregarAvisos()}
 if(role==="portaria"){S.encomendas=[];carregarPortaria()}
 S.reservas=[];S.bloqueios=[];carregarReservas();
 render()}
function sairLocal(){apagarToken();S.real=null;S.usuarios=S.usuarios.filter(function(u){return u.id!=="real"});S.role=null;S.screen=null;S.sheet=null;S.login={step:"email",email:"",codigo:"",err:""}}
window.aoPerderSessao=function(msg){if(!S.real)return;sairLocal();toast(msg||"Entre novamente para continuar.");render()};
function carregarPedidos(){return chamarServidor("cadastro.listar",{},{silencioso:true}).then(function(l){var lista=[];S.srvMor={};
 l.forEach(function(g){S.srvMor[g.pedido]=g.moradores||[];g.pessoas.forEach(function(p){lista.push({id:p.id,pedido:g.pedido,origem:g.origem,solicitante:g.solicitante,apto:g.unidade,criado:g.criadoEm,nome:p.nome,email:p.email,tel:p.telefone||"",semTel:!!p.semTelefone,vinc:p.vinculo,wa:!!p.whatsapp,status:p.status,decididoPor:p.decididoPor,decididoEm:p.decididoEm,motivo:p.motivoInterno,alertas:p.alertas||[]})})});
 S.solicitacoes=lista;render()},function(e){toast(e.mensagem);render()})}
function carregarMeusPedidos(){return chamarServidor("cadastro.meusPedidos",{},{silencioso:true}).then(function(l){S.meusPedidos=l||[];render()},function(){})}
var CFGMAP=[["nome","nomeCondominio"],["andares","andares"],["porLado","aptosPorLado"],["cota","cotaEmailDia"],["emailReserva","emailReservadoCodigos"],["lembrete","lembreteRetiradaDias"],["codigoMin","codigoValidadeMin"],["codigoTent","codigoTentativas"],["sesMorador","sessaoMoradorDias"],["sesPortaria","sessaoPortariaDias"],["sesAdm","sessaoAdmDias"],["portariaEmail","portariaEmail"],["portRelogin","portariaReloginMin"],["exigirPin","exigirPinPorteiro"],["locAntMin","locAntecedenciaDias"],["locDocsDias","locDocsDias"],["fotoDias","fotoEncomendaDias"],["bkpDias","backupDias"],["cadDia","cadastroPedidosDia"],["cadPessoas","cadastroPessoasPorPedido"],["locSoProp","locSoProprietario"],["inclSoTitular","inclusaoSoTitular"],["waAtivo","waAtivo"],["waNumero","waNumero"],["waModelo","waModelo"]];
function aplicarConfig(c){if(!c)return;CFGMAP.forEach(function(m){if(c[m[1]]!==undefined)S.cfg[m[0]]=c[m[1]]});S.cfg.porAndar=S.cfg.porLado*2}
function usuarioDoServidor(u){return {id:u.id,apto:u.unidade||"",nome:u.nome,email:u.email||"",tel:u.telefone||"",wa:!!u.whatsapp,avEmail:u.avisoEmailEncomenda!==false,perfil:u.perfil,vinculo:u.vinculo||"",sit:u.situacao,turno:u.turno||"",mandato:u.mandatoAte||"",temPin:!!u.temPin}}
function carregarAdmin(){return chamarServidor("admin.carregar",{},{silencioso:true}).then(function(d){
 S.usuarios=d.usuarios.map(usuarioDoServidor);
 S.extras=d.extras.map(function(x){return {num:x.unidade,nome:x.nome,tipo:x.tipo,local:x.local||"",encomendas:!!x.recebeEncomendas,reservas:!!x.podeReservar,ativo:!!x.ativa}});
 aplicarConfig(d.config);if(S.real&&S.real.usuarioId)S.me.sindico=S.real.usuarioId;render()},function(e){toast(e.mensagem);render()})}
function carregarPerfil(){return chamarServidor("perfil.carregar",{},{silencioso:true}).then(aplicarPerfil,function(){})}
function aplicarPerfil(d){S.perfilSrv=d;var u=me();if(u){u.tel=d.telefone||"";u.wa=!!d.whatsapp;u.avEmail=d.avisoEmailEncomenda!==false}render()}
function salvarPerfil(dados,msg){chamarServidor("perfil.salvar",dados,{grava:true}).then(function(d){aplicarPerfil(d);toast(msg)},function(e){toast(e.mensagem);render()})}
function carregarPorteiros(){return chamarServidor("portaria.porteiros",{},{silencioso:true}).then(function(d){
 S.usuarios=S.usuarios.filter(function(u){return u.perfil!=="porteiro"}).concat(d.porteiros.map(function(p){return {id:p.id,nome:p.nome,turno:p.turno||"",perfil:"porteiro",sit:"Ativo",temPin:!!p.temPin,apto:"",email:""}}));
 S.cfg.exigirPin=!!d.exigirPin;S.cfg.portRelogin=d.reloginMin||S.cfg.portRelogin;render()},function(e){toast(e.mensagem);render()})}
function hojeLocal(){var d=new Date();return d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate())}
function encPorId(id){return S.encomendas.filter(function(x){return String(x.id)===String(id)})[0]}
function encDoServidor(e){return {id:e.id,lote:e.lote||null,apto:e.unidade,tipo:e.tipo,rem:e.remetente||"",data:e.data,hora:e.hora,porteiro:e.porteiro||"",cod:e.codigo,status:e.status,
 aviso:{enviado:"email",cota:"cota",invalido:"invalido"}[e.avisoEmail]||"app",foto:null,temFoto:!!e.temFoto,waEm:e.waEm||"",por:e.retiradaPor||"",em:e.retiradaData?quando(e.retiradaData,e.retiradaHora):"",entregue:e.entreguePor||"",
 editEm:e.editadoEm||"",editPor:e.editadoPor||"",excEm:e.excluidaEm||"",excPor:e.excluidaPor||"",excMotivo:e.motivoExclusao||""}}
function mesclarEnc(lista){lista.forEach(function(x){var i=-1;S.encomendas.forEach(function(y,k){if(String(y.id)===String(x.id))i=k});if(i>=0){x.foto=S.encomendas[i].foto||x.foto;S.encomendas[i]=x}else S.encomendas.unshift(x)})}
function carregarPortaria(){return chamarServidor("portaria.carregar",{},{silencioso:true}).then(function(d){
 S.usuarios=d.porteiros.map(function(p){return {id:p.id,nome:p.nome,turno:p.turno||"",perfil:"porteiro",sit:"Ativo",temPin:!!p.temPin,apto:"",email:""}}).concat(d.moradores.map(function(m){return {id:m.id,nome:m.nome,apto:m.unidade,perfil:"morador",vinculo:m.vinculo||"",sit:m.situacao,wa:!!m.whatsapp,tel:m.telefone||"",email:""}}));
 S.extras=d.extras.map(function(x){return {num:x.unidade,nome:x.nome,tipo:"residencial",local:"",encomendas:true,reservas:false,ativo:true}});
 S.encomendas=d.encomendas.map(encDoServidor);
 S.cfg.exigirPin=!!d.exigirPin;S.cfg.portRelogin=d.reloginMin||S.cfg.portRelogin;S.cfg.waAtivo=!!d.waAtivo;if(d.waModelo)S.cfg.waModelo=d.waModelo;S.cfg.lembrete=d.lembreteDias||S.cfg.lembrete;
 if(S.porteiro&&!user(S.porteiro))S.porteiro=null;render()},function(e){toast(e.mensagem);render()})}
function msgAvisoEnc(av,nMor){if(!nMor)return "Unidade sem morador cadastrado: avise por interfone.";return av==="enviado"?"Os moradores já veem o aviso no app e receberam um e-mail.":av==="cota"?"Os moradores já veem o aviso no app. O e-mail sai assim que houver cota.":av==="invalido"?"Os moradores já veem o aviso no app. O e-mail cadastrado parece inválido.":"Os moradores já veem o aviso no app."}
function registrarReal(){var f=S.f,un=f.un,n=f.itens.length;if(S.ui.ocupado)return;S.ui.ocupado=true;S.ui.okReg="";
 chamarServidor("encomendas.registrar",{porteiroId:S.porteiro,unidade:un,itens:f.itens.map(function(i){return {tipo:i.tipo,remetente:(i.rem||"").trim(),foto:i.foto||""}})},{grava:true}).then(function(d){
  var l=d.encomendas.map(encDoServidor);mesclarEnc(l);S.ui.lastEnc=l[0].id;S.portLast=Date.now();
  S.ui.okReg=(n>1?n+" encomendas registradas":"Registrada")+" para "+unLabel(un)+" às "+l[0].hora+" (código"+(n>1?"s ":" ")+l.map(function(x){return x.cod}).join(", ")+"). "+msgAvisoEnc(d.avisoEmail,d.moradores);
  f.itens=[novoItem()];render()},function(e){toast(e.mensagem);render()}).finally(function(){S.ui.ocupado=false})}
function carregarMinhasEnc(){return chamarServidor("encomendas.minhas",{},{silencioso:true}).then(function(l){S.encomendas=l.map(encDoServidor);render()},function(){})}
function carregarAvisos(){return chamarServidor("avisos.listar",{},{silencioso:true}).then(function(l){var ap=(me()||{}).apto;S.notifs=l.map(function(a){return {id:a.id,apto:ap,txt:a.texto,q:a.criadoEm,lida:!!a.lido,ir:a.destino||""}});render()},function(){})}
function carregarEncAdm(){return chamarServidor("encomendas.listar",{},{silencioso:true}).then(function(l){S.encomendas=l.map(encDoServidor);render()},function(e){toast(e.mensagem);render()})}
function resDoServidor(r){return {id:String(r.id),por:r.por||r.nome||"",area:String(r.area),data:r.data,turno:String(r.turno),apto:r.apto||"",nome:r.nome||"",status:r.status,isenta:!!r.isenta,taxa:r.taxa,origem:r.origem||"",criado:r.criado||"",motivo:r.motivo||"",convidados:r.convidados||[],ocupado:!!r.ocupado}}
function carregarReservas(){return chamarServidor("reservas.carregar",{},{silencioso:true}).then(function(d){
 S.areas=d.areas.map(function(a){a.turnos=(a.turnos||[]).map(function(t){t.id=String(t.id);return t});return a});S.bloqueios=d.bloqueios;S.reservas=d.reservas.map(resDoServidor);
 if(S.nr&&!area(S.nr.area))S.nr=null;render()},function(e){if(S.role!=="morador")toast(e.mensagem);render()})}
function salvarConvidados(r,lista,msg,limpar){if(S.ui.ocupado)return;S.ui.ocupado=true;
 chamarServidor("convidados.salvar",{reservaId:r.id,convidados:lista},{grava:true}).then(function(d){r.convidados=d.convidados;if(limpar)S.f={};toast(msg)},function(e){toast(e.mensagem);render()}).finally(function(){S.ui.ocupado=false})}
function solPorId(id){return S.solicitacoes.filter(function(y){return String(y.id)===String(id)})[0]}
function msgBoasVindas(st,email){return st==="enviado"?"Enviamos o e-mail de boas-vindas para "+email+".":st==="invalido"?"O e-mail "+email+" parece inválido: confira o cadastro.":"O e-mail de boas-vindas para "+email+" sai assim que houver cota de e-mails."}
function aprovarReal(lista){var ok=[],er=[],ultimo="";
 var seq=lista.reduce(function(p,x){return p.then(function(){var E=(S.ui.solEd&&S.ui.solEd[x.id])||{nome:x.nome,email:x.email,tel:x.tel,vinc:x.vinc};
  return chamarServidor("cadastro.aprovar",{id:x.id,nome:E.nome,email:E.email,telefone:E.tel,vinculo:E.vinc},{grava:true}).then(function(d){ok.push(d.nome);ultimo=msgBoasVindas(d.email_boasvindas,d.email)},function(e){er.push(x.nome+": "+e.mensagem)})})},Promise.resolve());
 return seq.then(function(){S.ui.okSol=ok.length?(ok.length===1?ok[0]+" aprovado(a). "+ultimo:ok.length+" pessoas aprovadas: "+ok.join(", ")+". Os e-mails de boas-vindas foram enviados ou estão na fila."):"";if(er.length)toast(er.join(" "));return carregarPedidos()})}
function retomarSessao(){try{if(!localStorage.getItem("marapendi.token."+(CFG.ambiente||"X")))return}catch(e){return}
 chamarServidor("sessao.eu",{}).then(function(eu){if(!S.role)entrarReal(eu)},function(){})}

function testarConexao(){
 S.conexao={st:"testando"};render();
 chamarServidor("sistema.ping",{},{silencioso:true}).then(function(d){
  S.conexao={st:"ok",msg:"Servidor de "+(d.ambiente||"?")+" conectado · servidor "+d.servidor+" · "+d.hora};render();
 },function(e){S.conexao={st:"erro",msg:e.mensagem};render()});
}
render();
testarConexao();
retomarSessao();
})();
