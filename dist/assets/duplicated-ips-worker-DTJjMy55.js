(function(){"use strict";var j={},R={},O={},C;function N(){if(C)return O;C=1,Object.defineProperty(O,"__esModule",{value:!0}),O.isInSubnet=u,O.isCorrect=g,O.numberToPaddedHex=S,O.stringToPaddedHex=b,O.testBit=p;function u(a){return this.subnetMask<a.subnetMask?!1:this.mask(a.subnetMask)===a.mask()}function g(a){return function(){return this.addressMinusSuffix!==this.correctForm()?!1:this.subnetMask===a&&!this.parsedSubnet?!0:this.parsedSubnet===String(this.subnetMask)}}function S(a){return a.toString(16).padStart(2,"0")}function b(a){return S(parseInt(a,10))}function p(a,f){const{length:l}=a;if(f>l)return!1;const t=l-f;return a.substring(t,t+1)==="1"}return O}var P={},H;function F(){return H||(H=1,Object.defineProperty(P,"__esModule",{value:!0}),P.RE_SUBNET_STRING=P.RE_ADDRESS=P.GROUPS=P.BITS=void 0,P.BITS=32,P.GROUPS=4,P.RE_ADDRESS=/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/g,P.RE_SUBNET_STRING=/\/\d{1,2}$/),P}var y={},L;function U(){if(L)return y;L=1,Object.defineProperty(y,"__esModule",{value:!0}),y.AddressError=void 0;class u extends Error{constructor(S,b){super(S),this.name="AddressError",this.parseMessage=b}}return y.AddressError=u,y}var q;function k(){if(q)return R;q=1;var u=R&&R.__createBinding||(Object.create?function(l,t,s,o){o===void 0&&(o=s);var c=Object.getOwnPropertyDescriptor(t,s);(!c||("get"in c?!t.__esModule:c.writable||c.configurable))&&(c={enumerable:!0,get:function(){return t[s]}}),Object.defineProperty(l,o,c)}:function(l,t,s,o){o===void 0&&(o=s),l[o]=t[s]}),g=R&&R.__setModuleDefault||(Object.create?function(l,t){Object.defineProperty(l,"default",{enumerable:!0,value:t})}:function(l,t){l.default=t}),S=R&&R.__importStar||function(l){if(l&&l.__esModule)return l;var t={};if(l!=null)for(var s in l)s!=="default"&&Object.prototype.hasOwnProperty.call(l,s)&&u(t,l,s);return g(t,l),t};Object.defineProperty(R,"__esModule",{value:!0}),R.Address4=void 0;const b=S(N()),p=S(F()),a=U();class f{constructor(t){this.groups=p.GROUPS,this.parsedAddress=[],this.parsedSubnet="",this.subnet="/32",this.subnetMask=32,this.v4=!0,this.isCorrect=b.isCorrect(p.BITS),this.isInSubnet=b.isInSubnet,this.address=t;const s=p.RE_SUBNET_STRING.exec(t);if(s){if(this.parsedSubnet=s[0].replace("/",""),this.subnetMask=parseInt(this.parsedSubnet,10),this.subnet=`/${this.subnetMask}`,this.subnetMask<0||this.subnetMask>p.BITS)throw new a.AddressError("Invalid subnet mask.");t=t.replace(p.RE_SUBNET_STRING,"")}this.addressMinusSuffix=t,this.parsedAddress=this.parse(t)}static isValid(t){try{return new f(t),!0}catch{return!1}}parse(t){const s=t.split(".");if(!t.match(p.RE_ADDRESS))throw new a.AddressError("Invalid IPv4 address.");return s}correctForm(){return this.parsedAddress.map(t=>parseInt(t,10)).join(".")}static fromHex(t){const s=t.replace(/:/g,"").padStart(8,"0"),o=[];let c;for(c=0;c<8;c+=2){const v=s.slice(c,c+2);o.push(parseInt(v,16))}return new f(o.join("."))}static fromInteger(t){return f.fromHex(t.toString(16))}static fromArpa(t){const o=t.replace(/(\.in-addr\.arpa)?\.$/,"").split(".").reverse().join(".");return new f(o)}toHex(){return this.parsedAddress.map(t=>b.stringToPaddedHex(t)).join(":")}toArray(){return this.parsedAddress.map(t=>parseInt(t,10))}toGroup6(){const t=[];let s;for(s=0;s<p.GROUPS;s+=2)t.push(`${b.stringToPaddedHex(this.parsedAddress[s])}${b.stringToPaddedHex(this.parsedAddress[s+1])}`);return t.join(":")}bigInt(){return BigInt(`0x${this.parsedAddress.map(t=>b.stringToPaddedHex(t)).join("")}`)}_startAddress(){return BigInt(`0b${this.mask()+"0".repeat(p.BITS-this.subnetMask)}`)}startAddress(){return f.fromBigInt(this._startAddress())}startAddressExclusive(){const t=BigInt("1");return f.fromBigInt(this._startAddress()+t)}_endAddress(){return BigInt(`0b${this.mask()+"1".repeat(p.BITS-this.subnetMask)}`)}endAddress(){return f.fromBigInt(this._endAddress())}endAddressExclusive(){const t=BigInt("1");return f.fromBigInt(this._endAddress()-t)}static fromBigInt(t){return f.fromHex(t.toString(16))}mask(t){return t===void 0&&(t=this.subnetMask),this.getBitsBase2(0,t)}getBitsBase2(t,s){return this.binaryZeroPad().slice(t,s)}reverseForm(t){t||(t={});const s=this.correctForm().split(".").reverse().join(".");return t.omitSuffix?s:`${s}.in-addr.arpa.`}isMulticast(){return this.isInSubnet(new f("224.0.0.0/4"))}binaryZeroPad(){return this.bigInt().toString(2).padStart(p.BITS,"0")}groupForV6(){const t=this.parsedAddress;return this.address.replace(p.RE_ADDRESS,`<span class="hover-group group-v4 group-6">${t.slice(0,2).join(".")}</span>.<span class="hover-group group-v4 group-7">${t.slice(2,4).join(".")}</span>`)}}return R.Address4=f,R}var M={},I={},Z;function z(){return Z||(Z=1,Object.defineProperty(I,"__esModule",{value:!0}),I.RE_URL_WITH_PORT=I.RE_URL=I.RE_ZONE_STRING=I.RE_SUBNET_STRING=I.RE_BAD_ADDRESS=I.RE_BAD_CHARACTERS=I.TYPES=I.SCOPES=I.GROUPS=I.BITS=void 0,I.BITS=128,I.GROUPS=8,I.SCOPES={0:"Reserved",1:"Interface local",2:"Link local",4:"Admin local",5:"Site local",8:"Organization local",14:"Global",15:"Reserved"},I.TYPES={"ff01::1/128":"Multicast (All nodes on this interface)","ff01::2/128":"Multicast (All routers on this interface)","ff02::1/128":"Multicast (All nodes on this link)","ff02::2/128":"Multicast (All routers on this link)","ff05::2/128":"Multicast (All routers in this site)","ff02::5/128":"Multicast (OSPFv3 AllSPF routers)","ff02::6/128":"Multicast (OSPFv3 AllDR routers)","ff02::9/128":"Multicast (RIP routers)","ff02::a/128":"Multicast (EIGRP routers)","ff02::d/128":"Multicast (PIM routers)","ff02::16/128":"Multicast (MLDv2 reports)","ff01::fb/128":"Multicast (mDNSv6)","ff02::fb/128":"Multicast (mDNSv6)","ff05::fb/128":"Multicast (mDNSv6)","ff02::1:2/128":"Multicast (All DHCP servers and relay agents on this link)","ff05::1:2/128":"Multicast (All DHCP servers and relay agents in this site)","ff02::1:3/128":"Multicast (All DHCP servers on this link)","ff05::1:3/128":"Multicast (All DHCP servers in this site)","::/128":"Unspecified","::1/128":"Loopback","ff00::/8":"Multicast","fe80::/10":"Link-local unicast"},I.RE_BAD_CHARACTERS=/([^0-9a-f:/%])/gi,I.RE_BAD_ADDRESS=/([0-9a-f]{5,}|:{3,}|[^:]:$|^:[^:]|\/$)/gi,I.RE_SUBNET_STRING=/\/\d{1,3}(?=%|$)/,I.RE_ZONE_STRING=/%.*$/,I.RE_URL=/^\[{0,1}([0-9a-f:]+)\]{0,1}/,I.RE_URL_WITH_PORT=/\[([0-9a-f:]+)\]:([0-9]{1,5})/),I}var T={},V;function Y(){if(V)return T;V=1,Object.defineProperty(T,"__esModule",{value:!0}),T.spanAllZeroes=u,T.spanAll=g,T.spanLeadingZeroes=b,T.simpleGroup=p;function u(a){return a.replace(/(0+)/g,'<span class="zero">$1</span>')}function g(a,f=0){return a.split("").map((t,s)=>`<span class="digit value-${t} position-${s+f}">${u(t)}</span>`).join("")}function S(a){return a.replace(/^(0+)/,'<span class="zero">$1</span>')}function b(a){return a.split(":").map(l=>S(l)).join(":")}function p(a,f=0){return a.split(":").map((t,s)=>/group-v4/.test(t)?t:`<span class="hover-group group-${s+f}">${S(t)}</span>`)}return T}var E={},W;function te(){if(W)return E;W=1;var u=E&&E.__createBinding||(Object.create?function(t,s,o,c){c===void 0&&(c=o);var v=Object.getOwnPropertyDescriptor(s,o);(!v||("get"in v?!s.__esModule:v.writable||v.configurable))&&(v={enumerable:!0,get:function(){return s[o]}}),Object.defineProperty(t,c,v)}:function(t,s,o,c){c===void 0&&(c=o),t[c]=s[o]}),g=E&&E.__setModuleDefault||(Object.create?function(t,s){Object.defineProperty(t,"default",{enumerable:!0,value:s})}:function(t,s){t.default=s}),S=E&&E.__importStar||function(t){if(t&&t.__esModule)return t;var s={};if(t!=null)for(var o in t)o!=="default"&&Object.prototype.hasOwnProperty.call(t,o)&&u(s,t,o);return g(s,t),s};Object.defineProperty(E,"__esModule",{value:!0}),E.ADDRESS_BOUNDARY=void 0,E.groupPossibilities=p,E.padGroup=a,E.simpleRegularExpression=f,E.possibleElisions=l;const b=S(z());function p(t){return`(${t.join("|")})`}function a(t){return t.length<4?`0{0,${4-t.length}}${t}`:t}E.ADDRESS_BOUNDARY="[^A-Fa-f0-9:]";function f(t){const s=[];t.forEach((c,v)=>{parseInt(c,16)===0&&s.push(v)});const o=s.map(c=>t.map((v,m)=>{if(m===c){const w=m===0||m===b.GROUPS-1?":":"";return p([a(v),w])}return a(v)}).join(":"));return o.push(t.map(a).join(":")),p(o)}function l(t,s,o){const c=s?"":":",v=o?"":":",m=[];!s&&!o&&m.push("::"),s&&o&&m.push(""),(o&&!s||!o&&s)&&m.push(":"),m.push(`${c}(:0{1,4}){1,${t-1}}`),m.push(`(0{1,4}:){1,${t-1}}${v}`),m.push(`(0{1,4}:){${t-1}}0{1,4}`);for(let w=1;w<t-1;w++)for(let x=1;x<t-w;x++)m.push(`(0{1,4}:){${x}}:(0{1,4}:){${t-x-w-1}}0{1,4}`);return p(m)}return E}var X;function re(){if(X)return M;X=1;var u=M&&M.__createBinding||(Object.create?function(d,e,r,i){i===void 0&&(i=r);var n=Object.getOwnPropertyDescriptor(e,r);(!n||("get"in n?!e.__esModule:n.writable||n.configurable))&&(n={enumerable:!0,get:function(){return e[r]}}),Object.defineProperty(d,i,n)}:function(d,e,r,i){i===void 0&&(i=r),d[i]=e[r]}),g=M&&M.__setModuleDefault||(Object.create?function(d,e){Object.defineProperty(d,"default",{enumerable:!0,value:e})}:function(d,e){d.default=e}),S=M&&M.__importStar||function(d){if(d&&d.__esModule)return d;var e={};if(d!=null)for(var r in d)r!=="default"&&Object.prototype.hasOwnProperty.call(d,r)&&u(e,d,r);return g(e,d),e};Object.defineProperty(M,"__esModule",{value:!0}),M.Address6=void 0;const b=S(N()),p=S(F()),a=S(z()),f=S(Y()),l=k(),t=te(),s=U(),o=N();function c(d){if(!d)throw new Error("Assertion failed.")}function v(d){const e=/(\d+)(\d{3})/;for(;e.test(d);)d=d.replace(e,"$1,$2");return d}function m(d){return d=d.replace(/^(0{1,})([1-9]+)$/,'<span class="parse-error">$1</span>$2'),d=d.replace(/^(0{1,})(0)$/,'<span class="parse-error">$1</span>$2'),d}function w(d,e){const r=[],i=[];let n;for(n=0;n<d.length;n++)n<e[0]?r.push(d[n]):n>e[1]&&i.push(d[n]);return r.concat(["compact"]).concat(i)}function x(d){return parseInt(d,16).toString(16).padStart(4,"0")}function ee(d){return d&255}class A{constructor(e,r){this.addressMinusSuffix="",this.parsedSubnet="",this.subnet="/128",this.subnetMask=128,this.v4=!1,this.zone="",this.isInSubnet=b.isInSubnet,this.isCorrect=b.isCorrect(a.BITS),r===void 0?this.groups=a.GROUPS:this.groups=r,this.address=e;const i=a.RE_SUBNET_STRING.exec(e);if(i){if(this.parsedSubnet=i[0].replace("/",""),this.subnetMask=parseInt(this.parsedSubnet,10),this.subnet=`/${this.subnetMask}`,Number.isNaN(this.subnetMask)||this.subnetMask<0||this.subnetMask>a.BITS)throw new s.AddressError("Invalid subnet mask.");e=e.replace(a.RE_SUBNET_STRING,"")}else if(/\//.test(e))throw new s.AddressError("Invalid subnet mask.");const n=a.RE_ZONE_STRING.exec(e);n&&(this.zone=n[0],e=e.replace(a.RE_ZONE_STRING,"")),this.addressMinusSuffix=e,this.parsedAddress=this.parse(this.addressMinusSuffix)}static isValid(e){try{return new A(e),!0}catch{return!1}}static fromBigInt(e){const r=e.toString(16).padStart(32,"0"),i=[];let n;for(n=0;n<a.GROUPS;n++)i.push(r.slice(n*4,(n+1)*4));return new A(i.join(":"))}static fromURL(e){let r,i=null,n;if(e.indexOf("[")!==-1&&e.indexOf("]:")!==-1){if(n=a.RE_URL_WITH_PORT.exec(e),n===null)return{error:"failed to parse address with port",address:null,port:null};r=n[1],i=n[2]}else if(e.indexOf("/")!==-1){if(e=e.replace(/^[a-z0-9]+:\/\//,""),n=a.RE_URL.exec(e),n===null)return{error:"failed to parse address from URL",address:null,port:null};r=n[1]}else r=e;return i?(i=parseInt(i,10),(i<0||i>65536)&&(i=null)):i=null,{address:new A(r),port:i}}static fromAddress4(e){const r=new l.Address4(e),i=a.BITS-(p.BITS-r.subnetMask);return new A(`::ffff:${r.correctForm()}/${i}`)}static fromArpa(e){let r=e.replace(/(\.ip6\.arpa)?\.$/,"");const i=7;if(r.length!==63)throw new s.AddressError("Invalid 'ip6.arpa' form.");const n=r.split(".").reverse();for(let h=i;h>0;h--){const B=h*4;n.splice(B,0,":")}return r=n.join(""),new A(r)}microsoftTranscription(){return`${this.correctForm().replace(/:/g,"-")}.ipv6-literal.net`}mask(e=this.subnetMask){return this.getBitsBase2(0,e)}possibleSubnets(e=128){const r=a.BITS-this.subnetMask,i=Math.abs(e-a.BITS),n=r-i;return n<0?"0":v((BigInt("2")**BigInt(n)).toString(10))}_startAddress(){return BigInt(`0b${this.mask()+"0".repeat(a.BITS-this.subnetMask)}`)}startAddress(){return A.fromBigInt(this._startAddress())}startAddressExclusive(){const e=BigInt("1");return A.fromBigInt(this._startAddress()+e)}_endAddress(){return BigInt(`0b${this.mask()+"1".repeat(a.BITS-this.subnetMask)}`)}endAddress(){return A.fromBigInt(this._endAddress())}endAddressExclusive(){const e=BigInt("1");return A.fromBigInt(this._endAddress()-e)}getScope(){let e=a.SCOPES[parseInt(this.getBits(12,16).toString(10),10)];return this.getType()==="Global unicast"&&e!=="Link local"&&(e="Global"),e||"Unknown"}getType(){for(const e of Object.keys(a.TYPES))if(this.isInSubnet(new A(e)))return a.TYPES[e];return"Global unicast"}getBits(e,r){return BigInt(`0b${this.getBitsBase2(e,r)}`)}getBitsBase2(e,r){return this.binaryZeroPad().slice(e,r)}getBitsBase16(e,r){const i=r-e;if(i%4!==0)throw new Error("Length of bits to retrieve must be divisible by four");return this.getBits(e,r).toString(16).padStart(i/4,"0")}getBitsPastSubnet(){return this.getBitsBase2(this.subnetMask,a.BITS)}reverseForm(e){e||(e={});const r=Math.floor(this.subnetMask/4),i=this.canonicalForm().replace(/:/g,"").split("").slice(0,r).reverse().join(".");return r>0?e.omitSuffix?i:`${i}.ip6.arpa.`:e.omitSuffix?"":"ip6.arpa."}correctForm(){let e,r=[],i=0;const n=[];for(e=0;e<this.parsedAddress.length;e++){const _=parseInt(this.parsedAddress[e],16);_===0&&i++,_!==0&&i>0&&(i>1&&n.push([e-i,e-1]),i=0)}i>1&&n.push([this.parsedAddress.length-i,this.parsedAddress.length-1]);const h=n.map(_=>_[1]-_[0]+1);if(n.length>0){const _=h.indexOf(Math.max(...h));r=w(this.parsedAddress,n[_])}else r=this.parsedAddress;for(e=0;e<r.length;e++)r[e]!=="compact"&&(r[e]=parseInt(r[e],16).toString(16));let B=r.join(":");return B=B.replace(/^compact$/,"::"),B=B.replace(/(^compact)|(compact$)/,":"),B=B.replace(/compact/,""),B}binaryZeroPad(){return this.bigInt().toString(2).padStart(a.BITS,"0")}parse4in6(e){const r=e.split(":"),n=r.slice(-1)[0].match(p.RE_ADDRESS);if(n){this.parsedAddress4=n[0],this.address4=new l.Address4(this.parsedAddress4);for(let h=0;h<this.address4.groups;h++)if(/^0[0-9]+/.test(this.address4.parsedAddress[h]))throw new s.AddressError("IPv4 addresses can't have leading zeroes.",e.replace(p.RE_ADDRESS,this.address4.parsedAddress.map(m).join(".")));this.v4=!0,r[r.length-1]=this.address4.toGroup6(),e=r.join(":")}return e}parse(e){e=this.parse4in6(e);const r=e.match(a.RE_BAD_CHARACTERS);if(r)throw new s.AddressError(`Bad character${r.length>1?"s":""} detected in address: ${r.join("")}`,e.replace(a.RE_BAD_CHARACTERS,'<span class="parse-error">$1</span>'));const i=e.match(a.RE_BAD_ADDRESS);if(i)throw new s.AddressError(`Address failed regex: ${i.join("")}`,e.replace(a.RE_BAD_ADDRESS,'<span class="parse-error">$1</span>'));let n=[];const h=e.split("::");if(h.length===2){let B=h[0].split(":"),_=h[1].split(":");B.length===1&&B[0]===""&&(B=[]),_.length===1&&_[0]===""&&(_=[]);const D=this.groups-(B.length+_.length);if(!D)throw new s.AddressError("Error parsing groups");this.elidedGroups=D,this.elisionBegin=B.length,this.elisionEnd=B.length+this.elidedGroups,n=n.concat(B);for(let G=0;G<D;G++)n.push("0");n=n.concat(_)}else if(h.length===1)n=e.split(":"),this.elidedGroups=0;else throw new s.AddressError("Too many :: groups found");if(n=n.map(B=>parseInt(B,16).toString(16)),n.length!==this.groups)throw new s.AddressError("Incorrect number of groups found");return n}canonicalForm(){return this.parsedAddress.map(x).join(":")}decimal(){return this.parsedAddress.map(e=>parseInt(e,16).toString(10).padStart(5,"0")).join(":")}bigInt(){return BigInt(`0x${this.parsedAddress.map(x).join("")}`)}to4(){const e=this.binaryZeroPad().split("");return l.Address4.fromHex(BigInt(`0b${e.slice(96,128).join("")}`).toString(16))}to4in6(){const e=this.to4(),i=new A(this.parsedAddress.slice(0,6).join(":"),6).correctForm();let n="";return/:$/.test(i)||(n=":"),i+n+e.address}inspectTeredo(){const e=this.getBitsBase16(0,32),i=(this.getBits(80,96)^BigInt("0xffff")).toString(),n=l.Address4.fromHex(this.getBitsBase16(32,64)),h=this.getBits(96,128),B=l.Address4.fromHex((h^BigInt("0xffffffff")).toString(16)),_=this.getBitsBase2(64,80),D=(0,o.testBit)(_,15),G=(0,o.testBit)(_,14),oe=(0,o.testBit)(_,8),ue=(0,o.testBit)(_,9),le=BigInt(`0b${_.slice(2,6)+_.slice(8,16)}`).toString(10);return{prefix:`${e.slice(0,4)}:${e.slice(4,8)}`,server4:n.address,client4:B.address,flags:_,coneNat:D,microsoft:{reserved:G,universalLocal:ue,groupIndividual:oe,nonce:le},udpPort:i}}inspect6to4(){const e=this.getBitsBase16(0,16),r=l.Address4.fromHex(this.getBitsBase16(16,48));return{prefix:e.slice(0,4),gateway:r.address}}to6to4(){if(!this.is4())return null;const e=["2002",this.getBitsBase16(96,112),this.getBitsBase16(112,128),"","/16"].join(":");return new A(e)}toByteArray(){const e=this.bigInt().toString(16),i=`${"0".repeat(e.length%2)}${e}`,n=[];for(let h=0,B=i.length;h<B;h+=2)n.push(parseInt(i.substring(h,h+2),16));return n}toUnsignedByteArray(){return this.toByteArray().map(ee)}static fromByteArray(e){return this.fromUnsignedByteArray(e.map(ee))}static fromUnsignedByteArray(e){const r=BigInt("256");let i=BigInt("0"),n=BigInt("1");for(let h=e.length-1;h>=0;h--)i+=n*BigInt(e[h].toString(10)),n*=r;return A.fromBigInt(i)}isCanonical(){return this.addressMinusSuffix===this.canonicalForm()}isLinkLocal(){return this.getBitsBase2(0,64)==="1111111010000000000000000000000000000000000000000000000000000000"}isMulticast(){return this.getType()==="Multicast"}is4(){return this.v4}isTeredo(){return this.isInSubnet(new A("2001::/32"))}is6to4(){return this.isInSubnet(new A("2002::/16"))}isLoopback(){return this.getType()==="Loopback"}href(e){return e===void 0?e="":e=`:${e}`,`http://[${this.correctForm()}]${e}/`}link(e){e||(e={}),e.className===void 0&&(e.className=""),e.prefix===void 0&&(e.prefix="/#address="),e.v4===void 0&&(e.v4=!1);let r=this.correctForm;e.v4&&(r=this.to4in6);const i=r.call(this);return e.className?`<a href="${e.prefix}${i}" class="${e.className}">${i}</a>`:`<a href="${e.prefix}${i}">${i}</a>`}group(){if(this.elidedGroups===0)return f.simpleGroup(this.address).join(":");c(typeof this.elidedGroups=="number"),c(typeof this.elisionBegin=="number");const e=[],[r,i]=this.address.split("::");r.length?e.push(...f.simpleGroup(r)):e.push("");const n=["hover-group"];for(let h=this.elisionBegin;h<this.elisionBegin+this.elidedGroups;h++)n.push(`group-${h}`);return e.push(`<span class="${n.join(" ")}"></span>`),i.length?e.push(...f.simpleGroup(i,this.elisionEnd)):e.push(""),this.is4()&&(c(this.address4 instanceof l.Address4),e.pop(),e.push(this.address4.groupForV6())),e.join(":")}regularExpressionString(e=!1){let r=[];const i=new A(this.correctForm());if(i.elidedGroups===0)r.push((0,t.simpleRegularExpression)(i.parsedAddress));else if(i.elidedGroups===a.GROUPS)r.push((0,t.possibleElisions)(a.GROUPS));else{const n=i.address.split("::");n[0].length&&r.push((0,t.simpleRegularExpression)(n[0].split(":"))),c(typeof i.elidedGroups=="number"),r.push((0,t.possibleElisions)(i.elidedGroups,n[0].length!==0,n[1].length!==0)),n[1].length&&r.push((0,t.simpleRegularExpression)(n[1].split(":"))),r=[r.join(":")]}return e||(r=["(?=^|",t.ADDRESS_BOUNDARY,"|[^\\w\\:])(",...r,")(?=[^\\w\\:]|",t.ADDRESS_BOUNDARY,"|$)"]),r.join("")}regularExpression(e=!1){return new RegExp(this.regularExpressionString(e),"i")}}return M.Address6=A,M}var J;function se(){return J||(J=1,function(u){var g=j&&j.__createBinding||(Object.create?function(t,s,o,c){c===void 0&&(c=o);var v=Object.getOwnPropertyDescriptor(s,o);(!v||("get"in v?!s.__esModule:v.writable||v.configurable))&&(v={enumerable:!0,get:function(){return s[o]}}),Object.defineProperty(t,c,v)}:function(t,s,o,c){c===void 0&&(c=o),t[c]=s[o]}),S=j&&j.__setModuleDefault||(Object.create?function(t,s){Object.defineProperty(t,"default",{enumerable:!0,value:s})}:function(t,s){t.default=s}),b=j&&j.__importStar||function(t){if(t&&t.__esModule)return t;var s={};if(t!=null)for(var o in t)o!=="default"&&Object.prototype.hasOwnProperty.call(t,o)&&g(s,t,o);return S(s,t),s};Object.defineProperty(u,"__esModule",{value:!0}),u.v6=u.AddressError=u.Address6=u.Address4=void 0;var p=k();Object.defineProperty(u,"Address4",{enumerable:!0,get:function(){return p.Address4}});var a=re();Object.defineProperty(u,"Address6",{enumerable:!0,get:function(){return a.Address6}});var f=U();Object.defineProperty(u,"AddressError",{enumerable:!0,get:function(){return f.AddressError}});const l=b(Y());u.v6={helpers:l}}(j)),j}var $=se();function ne(u,g){const S=$.Address4.isValid(u),b=$.Address4.isValid(g),p=$.Address6.isValid(u),a=$.Address6.isValid(g);if(S&&b)return K(u,g,32);if(p&&a)return K(u,g,128);throw new Error("IP versions do not match or are invalid")}function K(u,g,S){const b=Q(u),p=Q(g);let a=0;for(;b>>BigInt(a)!==p>>BigInt(a);)a++;const f=S-a,l=ie(b,S).split(".");return l[l.length-1]="0",l.join(".")+"/"+Math.min(f,24)}function Q(u){if($.Address4.isValid(u))return BigInt(new $.Address4(u).bigInt().toString());if($.Address6.isValid(u))return BigInt(new $.Address6(u).bigInt().toString());throw new Error("Invalid IP Address")}function ie(u,g){if(g===32)return $.Address4.fromBigInt(u).correctForm();if(g===128)return $.Address6.fromBigInt(u).correctForm();throw new Error("Invalid maxBits value")}function ae(u){return $.Address6.isValid(u)?u.split(":").slice(0,-1).join():u.split(".").slice(0,-1).join(".")}addEventListener("message",u=>{const{data:g}=u.data;function S(b){const p=new Map,a=new Map;return b.forEach((f,l)=>{postMessage({type:"progress",data:Math.round((l+1)/g.length*100)});const t=ae(f.IP);p.get(t)?a.get(t)||a.set(t,ne(f.IP,f.IP)):p.set(t,f.IP)}),Array.from(a.values())}postMessage({type:"result",data:S(g)})})})();
