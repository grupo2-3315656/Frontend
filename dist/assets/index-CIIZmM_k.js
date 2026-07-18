(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=`http://localhost:3000/api`,t=null,n=0,r=()=>t,i=e=>{t=e},a=()=>n,o=()=>{n++},s=()=>{n=0},c=null,ee=()=>c,l=e=>{c=e},te=document.getElementById(`user-doc`),ne=document.getElementById(`btn-search`),u=document.getElementById(`search-error`),d=document.getElementById(`user-info-display`),f=document.getElementById(`task-form`),p=document.getElementById(`task-title`),m=document.getElementById(`title-error`),h=document.getElementById(`task-desc`),g=document.getElementById(`desc-error`),_=document.getElementById(`task-status`),v=document.getElementById(`status-error`),y=document.getElementById(`tasks-table`),b=document.getElementById(`task-count`),x=document.getElementById(`filter-title`),S=document.getElementById(`filter-status`),C=document.getElementById(`btn-export`),w=document.getElementById(`user-tasks-section`),T=document.getElementById(`task-users`),E=document.getElementById(`users-error`),D=document.getElementById(`selected-users`),O=async(e,t={})=>{let n;try{n=await fetch(e,t)}catch{throw Error(`Servicio no disponible`)}if(n.ok)return n.json();let r=`Error (Código: ${n.status})`;try{let e=await n.json();e?.error&&(r=e.error)}catch{}let i=Error(r);throw i.status=n.status,i},k=`${e}/users`,A={get:async()=>await O(k),getById:async e=>await O(`${k}/${e}`),create:async e=>await O(k,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify(e)}),update:async(e,t)=>await O(`${k}/${e}`,{method:`PATCH`,headers:{"Content-Type":`application/json`},body:JSON.stringify(t)}),delete:async e=>await O(`${k}/${e}`,{method:`DELETE`})},j=`${e}/assignments`,M=`${e}/tasks`,re=`${e}/users`,N={get:async()=>await O(j),getById:async e=>await O(`${j}/${e}`),getByTaskId:async e=>await O(`${M}/${e}/users`),getByUserId:async e=>await O(`${re}/${e}/tasks`),create:async e=>await O(j,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify(e)}),delete:async e=>await O(`${j}/${e}`,{method:`DELETE`})},ie=async e=>{let t=await A.getById(e);return{user:t,tasks:await N.getByUserId(t.id)}},P=`${e}/tasks`,F={get:async()=>await O(P),getById:async e=>await O(`${P}/${e}`),create:async e=>await O(P,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify(e)}),update:async(e,t)=>await O(`${P}/${e}`,{method:`PATCH`,headers:{"Content-Type":`application/json`},body:JSON.stringify(t)}),delete:async e=>await O(`${P}/${e}`,{method:`DELETE`})},ae=async e=>{let{userIds:t,...n}=e,r=await F.create(n);for(let e of t)await N.create({taskId:r.id,userId:e});return r},oe=async(e,t)=>{let{userIds:n,...r}=t,i=(await N.get()).filter(t=>t.taskId===e),a=i.map(e=>e.userId),o=n.filter(e=>!a.includes(e)),s=i.filter(e=>!n.includes(e.userId));for(let t of o)await N.create({taskId:e,userId:t});for(let e of s)await N.delete(e.id);return await F.update(e,r)},se=async e=>await F.delete(e),ce=e=>{let t=S.value,n=x.value.toLowerCase().trim();return e.filter(e=>{let r=t===`todos`||e.status===t,i=e.title.toLowerCase().includes(n);return r&&i})},le=e=>[...e].sort((e,t)=>new Date(e.date)-new Date(t.date)),ue=e=>[...e].sort((e,t)=>e.title.localeCompare(t.title)),de=(e,t)=>[...e].sort((e,n)=>e.status===t&&n.status!==t?-1:+(e.status!==t&&n.status===t)),fe=(e,t)=>!t||t===`date`?le(e):t===`name`?ue(e):t===`pendiente`||t===`en-progreso`||t===`completada`?de(e,t):e,pe=()=>{let e=document.querySelectorAll(`#tasks-table > .message-card`);return Array.from(e).map(e=>({id:e.id,title:e.querySelector(`.message-card__title`).textContent,description:e.querySelector(`.message-card__content`).textContent,status:e.querySelector(`.task-badge`).className.match(/task-badge--(\S+)/)[1],date:e.dataset.date||``,element:e}))},me=`
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
`,I=async()=>{let e=document.querySelector(`.card__order-bar`);e&&e.remove(),y.insertAdjacentHTML(`beforebegin`,me)},L=e=>{f.querySelectorAll(`input, textarea, select, button`).forEach(t=>{t.disabled=e})},R=()=>{y.innerHTML=``,s(),b.textContent=`0 Tareas`},z=e=>{d.innerHTML=`
    
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
    `},B=e=>e!=null&&e.trim()!==``,V={SUCCESS:`success`,ERROR:`error`,INFO:`info`},he={[V.SUCCESS]:`✅`,[V.ERROR]:`❌`,[V.INFO]:`ℹ️`},ge=e=>(e||(e=document.getElementById(`notifications-container`),e||(e=document.createElement(`div`),e.id=`notifications-container`,document.body.appendChild(e))),e),H=(e,t=V.INFO,n=1e3)=>{let r=document.createElement(`div`);return r.className=`notification notification--${t}`,r.setAttribute(`role`,`alert`),r.innerHTML=`
        <span class="notification__icon">${he[t]}</span>
        <span class="notification__message">${e}</span>
    `,ge().appendChild(r),setTimeout(()=>_e(r),n),r},_e=e=>{!e||e.classList.contains(`notification--dismissing`)||(e.classList.add(`notification--dismissing`),e.addEventListener(`animationend`,()=>e.remove(),{once:!0}))},U=e=>H(e,V.SUCCESS),W=e=>H(e,V.ERROR),ve=e=>H(e,V.INFO),ye={pendiente:`Pendiente`,"en-progreso":`En Progreso`,completada:`Completada`},be=e=>ye[e]||`Sin estado`,xe=(e,t=`tareas.json`)=>{let n=JSON.stringify(e,null,2),r=new Blob([n],{type:`application/json`}),i=URL.createObjectURL(r),a=document.createElement(`a`);a.href=i,a.download=t,a.click(),URL.revokeObjectURL(i)},Se=e=>{let t=document.querySelector(`.messages-empty`);t&&t.remove();let n=document.createElement(`div`);n.classList.add(`message-card`),e.id&&(n.id=`${e.id}`),e.date&&(n.dataset.date=e.date);let i=be(e.status),s=r()?.name||`Usuario`;n.innerHTML=`
    
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
    `,y.prepend(n),o(),b.textContent=`${a()} Tareas`},Ce=()=>{let e=document.querySelector(`.card__order-bar`);e&&e.remove()},G=()=>{Ce(),y.innerHTML=`
        <div class="messages-empty">
            <div class="messages-empty__icon">📋</div>
            <p class="messages-empty__text">El usuario no tiene tareas</p>
            <p class="messages-empty__subtext">Registre una nueva tarea.</p>
        </div>
    `},we=(e,t)=>{e.innerHTML=t},K=(e,t)=>{if(t===void 0)return e.textContent;e.textContent=t},Te=`task-badge--`,Ee=e=>{let t=e.className.split(` `);for(let e of t)if(e.startsWith(Te))return e.slice(12);return`sin-estado`},q=()=>{let e=y.querySelectorAll(`.message-card`);return e.length?Array.from(e).map(e=>{let t=e.querySelector(`.message-card__title`)?.textContent.trim()||``,n=e.querySelector(`.message-card__content`)?.textContent.trim()||``,r=e.querySelector(`.task-badge`),i=r?Ee(r):`sin-estado`;return{id:e.id,title:t,description:n,status:i}}):[]},De=()=>{let e=q();if(!e.length){ve(`No hay tareas visibles para exportar`);return}xe(e,`tareas.json`)},J=[],Y=!1,Oe=async()=>{if(!Y){Y=!0;try{T.innerHTML=`<option value="">Asignar a usuarios</option>`+(await A.get()).map(e=>`<option value="${e.id}">${e.name}</option>`).join(``)}catch{T.innerHTML=`<option value="">Error al cargar usuarios</option>`}}},ke=()=>J.map(e=>e.id),X=()=>{J=[],Z()},Ae=e=>{J=e.map(e=>({id:e.id,name:e.name})),Z()},Z=()=>{D.innerHTML=J.map(e=>`<span class="user-chip" data-initial="${e.name.charAt(0).toUpperCase()}">
            ${e.name}
            <button type="button" class="user-chip__remove" data-value="${e.id}">&times;</button>
        </span>`).join(``)};T.addEventListener(`focus`,Oe),T.addEventListener(`change`,()=>{let e=T.selectedOptions[0];!e||!e.value||(J.some(t=>t.id===e.value)||J.push({id:e.value,name:e.textContent}),T.value=``,Z())}),D.addEventListener(`click`,e=>{let t=e.target.closest(`.user-chip__remove`);t&&(J=J.filter(e=>e.id!==t.dataset.value),Z())});var Q=e=>{if(R(),!e.length){G();return}let t=ce(e);if(!t.length){G();return}I(),t.forEach(Se)},$=[];ne.addEventListener(`click`,async()=>{let e=te.value.trim();if(K(u,``),!B(e)){K(u,`Debe ingresar un documento`),W(`Debe ingresar un documento`);return}try{R();let{user:t,tasks:n}=await ie(e);i(t),z(t),L(!1),w.style.display=``,U(`Usuario encontrado correctamente`),$=n,$.length>0?Q($):(R(),G())}catch(e){L(!0),w.style.display=`none`,we(d,`
            <div class="message-card__content">❌ ${e.message}</div>
        `),W(e.message),R(),G(),console.error(e)}}),f.addEventListener(`submit`,async e=>{e.preventDefault();let t=p.value.trim(),n=h.value.trim(),r=_.value,i=ee();if(K(m,``),K(g,``),K(v,``),K(E,``),!B(t)){K(m,`Debe ingresar un título`),W(`Debe ingresar un título`);return}if(!B(n)){K(g,`Debe ingresar una descripción`),W(`Debe ingresar una descripción`);return}if(!B(r)){K(v,`Debe seleccionar un estado`),W(`Debe seleccionar un estado`);return}let a=ke();if(!a.length){K(E,`Debe seleccionar al menos un usuario`),W(`Debe seleccionar al menos un usuario`);return}try{if(i){let e=await oe(i,{userIds:a,title:t,description:n,status:r}),o=$.findIndex(t=>t.id==e.id);o!==-1&&($[o]=e),Q($),l(null),f.reset(),X(),K(f.querySelector(`button[type="submit"]`),`Guardar Tarea`),U(`Tarea actualizada correctamente`)}else{let e=await ae({userIds:a,title:t,description:n,status:r});$.push(e),Q($),f.reset(),X(),U(`Tarea registrada correctamente`)}}catch(e){W(e.message)}}),y.addEventListener(`click`,async e=>{let t=e.target.closest(`.btnUpdate`);if(!t)return;e.preventDefault();let n=t.getAttribute(`data-id`),r=t.closest(`.message-card`);if(!r)return;let i=K(r.querySelector(`.message-card__title`)).replace(`Tarea: `,``).trim(),a=K(r.querySelector(`.message-card__content`)).trim();p.value=i,h.value=a,_.value=``,l(n);try{Ae(await N.getByTaskId(n))}catch{}K(f.querySelector(`button[type="submit"]`),`Actualizar Tarea`),f.scrollIntoView({behavior:`smooth`,block:`center`}),p.focus()}),y.addEventListener(`click`,async e=>{let t=e.target.closest(`.btnDelete`);if(!t)return;e.preventDefault();let n=t.getAttribute(`data-id`);try{await se(n),$=$.filter(e=>e.id!=n),Q($),U(`Tarea eliminada correctamente`)}catch(e){W(e.message)}}),x.addEventListener(`input`,()=>Q($)),S.addEventListener(`change`,()=>Q($)),document.addEventListener(`change`,e=>{let t=e.target.closest(`#status-order`);if(!t)return;let n=t.value||`date`,r=pe();r.length&&fe(r,n).forEach(e=>{y.appendChild(e.element)})}),C.addEventListener(`click`,De);