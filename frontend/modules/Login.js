// import axios from 'axios';

// export default class Login {

//     constructor(formClass) {
//         this.form = document.querySelector(formClass);
//         this.document = document;
//         // console.log(formClass);
//     }

//     init() {
//         this.events();
//     }

//     events() { 
//         // alert(`teste  ${this.form}`)
//         if(!this.form) return;
//         this.form.addEventListener('click', e => {
//             // console.log(e);
//             this.validate(e);
//         });

//     }

//     async validate(e) {
//         const el = e.target;
//         // console.log(e.target);
//         // console.log(e.target.value);
//         if (el.name == "dtCambio") {
//             console.log(el.name);
//             console.log(el.value);
//             await this.setTaxaButton(el.value);
//         }

//         if (el.name == "codCli") {
//             // console.log(el.name);
//             // console.log(el.value);
//         }
//     }
      
//     async setTaxaButton(dtCambio) {
//         let txDolar = this.document.getElementById('txDolar');
//         txDolar.value = String(await this.setTaxa1('USD', dtCambio));
//         console.log(String(txDolar.value));
      
//         let txEuro = this.document.getElementById('txEuro');
//         txEuro.value = String(await this.setTaxa1('EUR', dtCambio));
//         console.log(String(txEuro.value));
//     }


//     // async setTaxa(moed, dt) {

//     //     console.log("result"); 
//     //     console.log(result);
      
//     //     let dol = result.value[4];
//     //     console.log(dol);
//     //     // console.log(String(dol.cotacaoVenda))
//     //     // console.log(dol.tipoBoletim)
      
//     //     return (dol.cotacaoVenda);
//     // }

//     setTaxa1(moed, dt) {
//         console.log("setTaxa")
//         let url = `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoMoedaDia(moeda=@moeda,dataCotacao=@dataCotacao)?@moeda='${moed}'&@dataCotacao='${`09-08-2022`}'&$top=100&$format=json&$select=cotacaoVenda,tipoBoletim`;
//         axios.get(url)
//           .then(response => {
//             const data = response.data
//             console.log("result"); 
//             console.log(data);
      
//             renderApiResult.textContent = JSON.stringify(data)
//           })
//           .catch(error => console.log(error))
//     }

//     async httpClient({ url = '', method = '', body = JSON.parse('{}') }) {
//         return new Promise((resolve, reject) => {
//             let request = new XMLHttpRequest();
//             console.log(url);
//             request.open(method, url, true);
//             request.onload = () => {
//                 if (request.status >= 200 && request.status < 300) {
//                     resolve(JSON.parse(request.responseText));
//                 } else {
//                     reject({
//                         status: request.status,
//                         statusText: request.statusText
//                     })
//                 }
//             }
//             request.onerror = () => {
//                 reject({
//                     status: request.status,
//                     statusText: request.statusText
//                 })
//             }

//             if (body) {
//                 request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
//                 body = JSON.stringify(body);
//             }
//             // request.send(body);
//         })
//     }
    
// }

// // // Função para inibir envio do formulario
// // const form1 = document.querySelector('#form1');
// // form1.addEventListener('submit', function (e) {
// //   e.preventDefault();
// //   console.log('Evendo Previnido')
// // });