(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=`http://localhost:3000/api`,t=null,n=0,r=()=>t,i=e=>{t=e},a=()=>n,o=()=>{n++},s=()=>{n=0},c=null,l=()=>c,u=e=>{c=e},ee=document.getElementById(`user-doc`),te=document.getElementById(`btn-search`),d=document.getElementById(`search-error`),f=document.getElementById(`user-info-display`),p=document.getElementById(`task-form`),m=document.getElementById(`task-title`),h=document.getElementById(`title-error`),g=document.getElementById(`task-desc`),_=document.getElementById(`desc-error`),v=document.getElementById(`task-status`),y=document.getElementById(`status-error`),b=document.getElementById(`tasks-table`),x=document.getElementById(`task-count`),S=document.getElementById(`filter-title`),C=document.getElementById(`filter-status`),ne=document.getElementById(`btn-export`),w=document.getElementById(`task-users`),T=document.getElementById(`users-error`),E=document.getElementById(`selected-users`),D=async(e,t={})=>{let n;try{n=await fetch(e,t)}catch{throw Error(`Servicio no disponible`)}if(n.ok)return n.json();let r=`Error (Código: ${n.status})`;try{let e=await n.json();e?.error&&(r=e.error)}catch{}let i=Error(r);throw i.status=n.status,i},O=`${e}/users`,k={get:async()=>await D(O),getById:async e=>await D(`${O}/${e}`),create:async e=>await D(O,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify(e)}),update:async(e,t)=>await D(`${O}/${e}`,{method:`PATCH`,headers:{"Content-Type":`application/json`},body:JSON.stringify(t)}),delete:async e=>await D(`${O}/${e}`,{method:`DELETE`})},A=`${e}/assignments`,j=`${e}/tasks`,M=`${e}/users`,N={get:async()=>await D(A),getById:async e=>await D(`${A}/${e}`),getByTaskId:async e=>await D(`${j}/${e}/users`),getByUserId:async e=>await D(`${M}/${e}/tasks`),create:async e=>await D(A,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify(e)}),delete:async e=>await D(`${A}/${e}`,{method:`DELETE`})},re=async e=>{let t=await k.getById(e);return{user:t,tasks:await N.getByUserId(t.id)}},P=`${e}/tasks`,F={get:async()=>await D(P),getById:async e=>await D(`${P}/${e}`),create:async e=>await D(P,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify(e)}),update:async(e,t)=>await D(`${P}/${e}`,{method:`PATCH`,headers:{"Content-Type":`application/json`},body:JSON.stringify(t)}),delete:async e=>await D(`${P}/${e}`,{method:`DELETE`})},ie=async e=>{let{userIds:t,...n}=e,r=await F.create(n);for(let e of t)await N.create({taskId:r.id,userId:e});return r},ae=async(e,t)=>{let{userIds:n,...r}=t,i=(await N.get()).filter(t=>t.taskId===e),a=i.map(e=>e.userId),o=n.filter(e=>!a.includes(e)),s=i.filter(e=>!n.includes(e.userId));for(let t of o)await N.create({taskId:e,userId:t});for(let e of s)await N.delete(e.id);return await F.update(e,r)},oe=async e=>await F.delete(e),se=e=>{let t=C.value,n=S.value.toLowerCase().trim();return e.filter(e=>{let r=t===`todos`||e.status===t,i=e.title.toLowerCase().includes(n);return r&&i})},ce=e=>[...e].sort((e,t)=>new Date(e.date)-new Date(t.date)),le=e=>[...e].sort((e,t)=>e.title.localeCompare(t.title)),ue=(e,t)=>[...e].sort((e,n)=>e.status===t&&n.status!==t?-1:+(e.status!==t&&n.status===t)),de=(e,t)=>!t||t===`date`?ce(e):t===`name`?le(e):t===`pendiente`||t===`en-progreso`||t===`completada`?ue(e,t):e,fe=()=>{let e=document.querySelectorAll(`#tasks-table > .message-card`);return Array.from(e).map(e=>({id:e.id,title:e.querySelector(`.message-card__title`).textContent,description:e.querySelector(`.message-card__content`).textContent,status:e.querySelector(`.task-badge`).className.match(/task-badge--(\S+)/)[1],date:e.dataset.date||``,element:e}))},pe=`
<div class="card__order-bar">
                    <label for="status-order" class="form__label"
                        >Ordenar Tareas:</label
                    >
                    <select
                        id="status-order"
                        class="form__input form__input--filter"
                    >
                        <option value="">Seleccione orden</option>
                        <option value="date">Fecha de creación</option>
                        <option value="name">Nombre de la tarea</option>
                        <option value="pendiente">Pendiente</option>
                        <option value="en-progreso">En Progreso</option>
                        <option value="completada">Completada</option>
                    </select>
                </div>
`,I=async()=>{let e=document.querySelector(`.card__order-bar`);e&&e.remove(),b.insertAdjacentHTML(`beforebegin`,pe)},L=e=>{p.querySelectorAll(`input, textarea, select, button`).forEach(t=>{t.disabled=e})},R=()=>{b.innerHTML=``,s(),x.textContent=`0 Tareas`},z=e=>{f.innerHTML=`
    
        <div class="message-card__header">
        
            <div class="message-card__user">
            
                <div class="message-card__avatar">
                    ${e.name.charAt(0)}
                </div>

                <div>
                    <div class="message-card__username">
                        ${e.name}
                    </div>

                    <div class="message-card__title">
                        Usuario encontrado
                    </div>
                </div>

            </div>

        </div>

        <div class="message-card__content">

            <strong>Documento:</strong> ${e.id}<br>
            <strong>Nombre:</strong> ${e.name}<br>
            <strong>Email:</strong> ${e.email}

        </div>
    `},B=e=>e!=null&&e.trim()!==``,V={SUCCESS:`success`,ERROR:`error`,INFO:`info`},me={[V.SUCCESS]:`✅`,[V.ERROR]:`❌`,[V.INFO]:`ℹ️`},he=e=>(e||(e=document.getElementById(`notifications-container`),e||(e=document.createElement(`div`),e.id=`notifications-container`,document.body.appendChild(e))),e),H=(e,t=V.INFO,n=1e3)=>{let r=document.createElement(`div`);return r.className=`notification notification--${t}`,r.setAttribute(`role`,`alert`),r.innerHTML=`
        <span class="notification__icon">${me[t]}</span>
        <span class="notification__message">${e}</span>
    `,he().appendChild(r),setTimeout(()=>ge(r),n),r},ge=e=>{!e||e.classList.contains(`notification--dismissing`)||(e.classList.add(`notification--dismissing`),e.addEventListener(`animationend`,()=>e.remove(),{once:!0}))},U=e=>H(e,V.SUCCESS),W=e=>H(e,V.ERROR),_e=e=>H(e,V.INFO),ve={pendiente:`Pendiente`,"en-progreso":`En Progreso`,completada:`Completada`},ye=e=>ve[e]||`Sin estado`,be=(e,t=`tareas.json`)=>{let n=JSON.stringify(e,null,2),r=new Blob([n],{type:`application/json`}),i=URL.createObjectURL(r),a=document.createElement(`a`);a.href=i,a.download=t,a.click(),URL.revokeObjectURL(i)},xe=e=>{let t=document.querySelector(`.messages-empty`);t&&t.remove();let n=document.createElement(`div`);n.classList.add(`message-card`),e.id&&(n.id=`${e.id}`),e.date&&(n.dataset.date=e.date);let i=ye(e.status),s=r()?.name||`Usuario`;n.innerHTML=`
    
        <div class="message-card__header">

            <div class="message-card__user">
                <div class="message-card__avatar">
                    ${s.charAt(0).toUpperCase()}
                </div>

                <div>
                    <div class="message-card__username">
                        ${s}
                    </div>
                    
                    <div class="message-card__title">
                        ${e.title}
                    </div>
                </div>
            </div>

            <span class="task-badge task-badge--${e.status}">
                ${i}
            </span>

        </div>
        
        <div class="message-card__body">
            <div class="message-card__content">
                ${e.description||`Sin descripción`}
            </div>
            <button type="button" class="btn btn--secondary btnUpdate" data-id="${e.id}">
                Actualizar
            </button>
            <button type="button" class="btn btn--secondary btnDelete" data-id="${e.id}">
                Eliminar
            </button>
        </div>
    `,b.prepend(n),o(),x.textContent=`${a()} Tareas`},Se=()=>{let e=document.querySelector(`.card__order-bar`);e&&e.remove()},G=()=>{Se(),b.innerHTML=`
        <div class="messages-empty">
            <div class="messages-empty__icon">📋</div>
            <p class="messages-empty__text">El usuario no tiene tareas</p>
            <p class="messages-empty__subtext">Registre una nueva tarea.</p>
        </div>
    `},Ce=(e,t)=>{e.innerHTML=t},K=(e,t)=>{if(t===void 0)return e.textContent;e.textContent=t},we=`task-badge--`,Te=e=>{let t=e.className.split(` `);for(let e of t)if(e.startsWith(we))return e.slice(12);return`sin-estado`},Ee=()=>{let e=b.querySelectorAll(`.message-card`);return e.length?Array.from(e).map(e=>{let t=e.querySelector(`.message-card__title`)?.textContent.trim()||``,n=e.querySelector(`.message-card__content`)?.textContent.trim()||``,r=e.querySelector(`.task-badge`),i=r?Te(r):`sin-estado`;return{id:e.id,title:t,description:n,status:i}}):[]},De=()=>{let e=Ee();if(!e.length){_e(`No hay tareas visibles para exportar`);return}be(e,`tareas.json`)},q=[],J=!1,Y=async()=>{if(!J){J=!0;try{w.innerHTML=`<option value="">Asignar a usuarios</option>`+(await k.get()).map(e=>`<option value="${e.id}">${e.name}</option>`).join(``)}catch{w.innerHTML=`<option value="">Error al cargar usuarios</option>`}}},Oe=()=>q.map(e=>e.id),X=()=>{q=[],Z()},ke=e=>{q=e.map(e=>({id:e.id,name:e.name})),Z()},Z=()=>{E.innerHTML=q.map(e=>`<span class="user-chip" data-initial="${e.name.charAt(0).toUpperCase()}">
            ${e.name}
            <button type="button" class="user-chip__remove" data-value="${e.id}">&times;</button>
        </span>`).join(``)};w.addEventListener(`focus`,Y),w.addEventListener(`change`,()=>{let e=w.selectedOptions[0];!e||!e.value||(q.some(t=>t.id===e.value)||q.push({id:e.value,name:e.textContent}),w.value=``,Z())}),E.addEventListener(`click`,e=>{let t=e.target.closest(`.user-chip__remove`);t&&(q=q.filter(e=>e.id!==t.dataset.value),Z())});var Q=e=>{if(R(),!e.length){G();return}let t=se(e);if(!t.length){G();return}I(),t.forEach(xe)},$=[];te.addEventListener(`click`,async()=>{let e=ee.value.trim();if(K(d,``),!B(e)){K(d,`Debe ingresar un documento`),W(`Debe ingresar un documento`);return}try{R();let{user:t,tasks:n}=await re(e);i(t),z(t),L(!1),U(`Usuario encontrado correctamente`),$=n,$.length>0?Q($):(R(),G())}catch(e){L(!0),Ce(f,`
            <div class="message-card__content">❌ ${e.message}</div>
        `),W(e.message),R(),G(),console.error(e)}}),p.addEventListener(`submit`,async e=>{e.preventDefault();let t=m.value.trim(),n=g.value.trim(),r=v.value,i=l();if(K(h,``),K(_,``),K(y,``),K(T,``),!B(t)){K(h,`Debe ingresar un título`),W(`Debe ingresar un título`);return}if(!B(n)){K(_,`Debe ingresar una descripción`),W(`Debe ingresar una descripción`);return}if(!B(r)){K(y,`Debe seleccionar un estado`),W(`Debe seleccionar un estado`);return}let a=Oe();if(!a.length){K(T,`Debe seleccionar al menos un usuario`),W(`Debe seleccionar al menos un usuario`);return}try{if(i){let e=await ae(i,{userIds:a,title:t,description:n,status:r}),o=$.findIndex(t=>t.id==e.id);o!==-1&&($[o]=e),Q($),u(null),p.reset(),X(),K(p.querySelector(`button[type="submit"]`),`Guardar Tarea`),U(`Tarea actualizada correctamente`)}else{let e=await ie({userIds:a,title:t,description:n,status:r});$.push(e),Q($),p.reset(),X(),U(`Tarea registrada correctamente`)}}catch(e){W(e.message)}}),b.addEventListener(`click`,async e=>{let t=e.target.closest(`.btnUpdate`);if(!t)return;e.preventDefault();let n=t.getAttribute(`data-id`),r=t.closest(`.message-card`);if(!r)return;let i=K(r.querySelector(`.message-card__title`)).replace(`Tarea: `,``).trim(),a=K(r.querySelector(`.message-card__content`)).trim();m.value=i,g.value=a,v.value=``,u(n);try{ke(await N.getByTaskId(n))}catch{}K(p.querySelector(`button[type="submit"]`),`Actualizar Tarea`),p.scrollIntoView({behavior:`smooth`,block:`center`}),m.focus()}),b.addEventListener(`click`,async e=>{let t=e.target.closest(`.btnDelete`);if(!t)return;e.preventDefault();let n=t.getAttribute(`data-id`);try{await oe(n),$=$.filter(e=>e.id!=n),Q($),U(`Tarea eliminada correctamente`)}catch(e){W(e.message)}}),S.addEventListener(`input`,()=>Q($)),C.addEventListener(`change`,()=>Q($)),document.addEventListener(`change`,e=>{let t=e.target.closest(`#status-order`);if(!t)return;let n=t.value||`date`,r=fe();r.length&&de(r,n).forEach(e=>{b.appendChild(e.element)})}),ne.addEventListener(`click`,De);