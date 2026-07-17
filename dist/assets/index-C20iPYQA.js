(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=`http://localhost:3000/api`,t=null,n=0,r=()=>t,i=e=>{t=e},a=()=>n,o=()=>{n++},s=()=>{n=0},c=null,l=()=>c,u=e=>{c=e},ee=document.getElementById(`user-doc`),te=document.getElementById(`btn-search`),d=document.getElementById(`search-error`),f=document.getElementById(`user-info-display`),p=document.getElementById(`task-form`),m=document.getElementById(`task-title`),h=document.getElementById(`title-error`),g=document.getElementById(`task-desc`),_=document.getElementById(`desc-error`),v=document.getElementById(`task-status`),y=document.getElementById(`status-error`),b=document.getElementById(`tasks-table`),x=document.getElementById(`task-count`),S=document.getElementById(`filter-title`),C=document.getElementById(`filter-status`),w=document.getElementById(`btn-export`);document.getElementById(`admin-header`),document.getElementById(`admin-panel`),document.getElementById(`admin-arrow`),document.getElementById(`admin-user-doc`),document.getElementById(`admin-search-error`),document.getElementById(`btn-admin-search`);var T=document.getElementById(`admin-user-id`),E=document.getElementById(`admin-id-error`);document.getElementById(`admin-user-name`),document.getElementById(`admin-name-error`),document.getElementById(`admin-user-email`),document.getElementById(`admin-email-error`),document.getElementById(`btn-admin-create`),document.getElementById(`admin-users-list`);var D=async(e,t={})=>{let n;try{n=await fetch(e,t)}catch{throw Error(`Servicio no disponible`)}if(n.ok)return n.json();let r=`Error (Código: ${n.status})`;try{let e=await n.json();e?.error&&(r=e.error)}catch{}let i=Error(r);throw i.status=n.status,i},O=`${e}/users`,k={get:async()=>await D(O),getById:async e=>await D(`${O}/${e}`),create:async e=>await D(O,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify(e)}),update:async(e,t)=>await D(`${O}/${e}`,{method:`PATCH`,headers:{"Content-Type":`application/json`},body:JSON.stringify(t)}),delete:async e=>await D(`${O}/${e}`,{method:`DELETE`})},A=`${e}/assignments`,j=`${e}/tasks`,ne=`${e}/users`,re={get:async()=>await D(A),getById:async e=>await D(`${A}/${e}`),getByTaskId:async e=>await D(`${j}/${e}/users`),getByUserId:async e=>await D(`${ne}/${e}/tasks`),create:async e=>await D(A,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify(e)}),delete:async e=>await D(`${A}/${e}`,{method:`DELETE`})},ie=async e=>{let t=await k.getById(e);return{user:t,tasks:await re.getByUserId(t.id)}},M=`${e}/tasks`,N={get:async()=>await D(M),getById:async e=>await D(`${M}/${e}`),create:async e=>await D(M,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify(e)}),update:async(e,t)=>await D(`${M}/${e}`,{method:`PATCH`,headers:{"Content-Type":`application/json`},body:JSON.stringify(t)}),delete:async e=>await D(`${M}/${e}`,{method:`DELETE`})},ae=async e=>await N.create(e),oe=async(e,t)=>await N.update(e,t),se=async e=>await N.delete(e),ce=e=>{let t=C.value,n=S.value.toLowerCase().trim();return e.filter(e=>{let r=t===`todos`||e.status===t,i=e.title.toLowerCase().includes(n);return r&&i})},le=e=>[...e].sort((e,t)=>new Date(e.date)-new Date(t.date)),ue=e=>[...e].sort((e,t)=>e.title.localeCompare(t.title)),de=(e,t)=>[...e].sort((e,n)=>e.status===t&&n.status!==t?-1:+(e.status!==t&&n.status===t)),P=(e,t)=>!t||t===`date`?le(e):t===`name`?ue(e):t===`pendiente`||t===`en-progreso`||t===`completada`?de(e,t):e,F=()=>{let e=document.querySelectorAll(`#tasks-table > .message-card`);return Array.from(e).map(e=>({id:e.id,title:e.querySelector(`.message-card__title`).textContent,description:e.querySelector(`.message-card__content`).textContent,status:e.querySelector(`.task-badge`).className.match(/task-badge--(\S+)/)[1],date:e.dataset.date||``,element:e}))},I=`
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
`,L=async()=>{let e=document.querySelector(`.card__order-bar`);e&&e.remove(),b.insertAdjacentHTML(`beforebegin`,I)},R=e=>{p.querySelectorAll(`input, textarea, select, button`).forEach(t=>{t.disabled=e})},z=()=>{b.innerHTML=``,s(),x.textContent=`0 Tareas`},B=e=>{f.innerHTML=`
    
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
    `},V=e=>e!=null&&e.trim()!==``,H={SUCCESS:`success`,ERROR:`error`,INFO:`info`},fe={[H.SUCCESS]:`✅`,[H.ERROR]:`❌`,[H.INFO]:`ℹ️`},pe=e=>(e||(e=document.getElementById(`notifications-container`),e||(e=document.createElement(`div`),e.id=`notifications-container`,document.body.appendChild(e))),e),U=(e,t=H.INFO,n=1e3)=>{let r=document.createElement(`div`);return r.className=`notification notification--${t}`,r.setAttribute(`role`,`alert`),r.innerHTML=`
        <span class="notification__icon">${fe[t]}</span>
        <span class="notification__message">${e}</span>
    `,pe().appendChild(r),setTimeout(()=>me(r),n),r},me=e=>{!e||e.classList.contains(`notification--dismissing`)||(e.classList.add(`notification--dismissing`),e.addEventListener(`animationend`,()=>e.remove(),{once:!0}))},W=e=>U(e,H.SUCCESS),G=e=>U(e,H.ERROR),he=e=>U(e,H.INFO),ge={pendiente:`Pendiente`,"en-progreso":`En Progreso`,completada:`Completada`},_e=e=>ge[e]||`Sin estado`,ve=(e,t=`tareas.json`)=>{let n=JSON.stringify(e,null,2),r=new Blob([n],{type:`application/json`}),i=URL.createObjectURL(r),a=document.createElement(`a`);a.href=i,a.download=t,a.click(),URL.revokeObjectURL(i)},ye=e=>{let t=document.querySelector(`.messages-empty`);t&&t.remove();let n=document.createElement(`div`);n.classList.add(`message-card`),e.id&&(n.id=`${e.id}`),e.date&&(n.dataset.date=e.date);let i=_e(e.status),s=r();n.innerHTML=`
    
        <div class="message-card__header">

            <div class="message-card__user">
                <div class="message-card__avatar">
                    ${s.name.charAt(0).toUpperCase()}
                </div>

                <div>
                    <div class="message-card__username">
                        ${s.name}
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
    `,b.prepend(n),o(),x.textContent=`${a()} Tareas`},be=()=>{let e=document.querySelector(`.card__order-bar`);e&&e.remove()},K=()=>{be(),b.innerHTML=`
        <div class="messages-empty">
            <div class="messages-empty__icon">📋</div>
            <p class="messages-empty__text">El usuario no tiene tareas</p>
            <p class="messages-empty__subtext">Registre una nueva tarea.</p>
        </div>
    `},xe=(e,t)=>{e.innerHTML=t},q=(e,t)=>{if(t===void 0)return e.textContent;e.textContent=t},Se=`task-badge--`,Ce=e=>{let t=e.className.split(` `);for(let e of t)if(e.startsWith(Se))return e.slice(12);return`sin-estado`},we=()=>{let e=b.querySelectorAll(`.message-card`);return e.length?Array.from(e).map(e=>{let t=e.querySelector(`.message-card__title`)?.textContent.trim()||``,n=e.querySelector(`.message-card__content`)?.textContent.trim()||``,r=e.querySelector(`.task-badge`),i=r?Ce(r):`sin-estado`;return{id:e.id,title:t,description:n,status:i}}):[]},Te=()=>{let e=we();if(!e.length){he(`No hay tareas visibles para exportar`);return}ve(e,`tareas.json`)},J=e=>{let t=e.name?e.name.charAt(0).toUpperCase():`?`;return`
        <div class="user-card" data-user-id="${e.id}">
            <div class="user-card__header">
                <div class="user-card__avatar">${t}</div>
                <div class="user-card__info">
                    <h4 class="user-card__name">${e.name}</h4>
                    <p class="user-card__email">${e.email}</p>
                    <p class="user-card__doc">Doc: ${e.id}</p>
                </div>
            </div>
            <div class="user-card__actions">
                <button class="btn btn--primary btn--sm btn-admin-update" data-id="${e.id}" data-name="${e.name}" data-email="${e.email}">
                    ✏️ Actualizar
                </button>
                <button class="btn btn--danger btn--sm btn-admin-delete" data-id="${e.id}">
                    🗑️ Eliminar
                </button>
            </div>
        </div>
    `},Y=(e,t)=>{if(!e||e.length===0){t.innerHTML=`
            <div class="messages-empty">
                <div class="messages-empty__icon">👥</div>
                <p class="messages-empty__text">No hay usuarios registrados</p>
            </div>
        `;return}t.innerHTML=e.map(J).join(``)},Ee=(e,t)=>{t.innerHTML=J(e)},X=(e,t)=>{e.classList.contains(`hidden`)?(e.classList.remove(`hidden`),t.textContent=`▲`):(e.classList.add(`hidden`),t.textContent=`▼`)},Z=e=>{if(z(),!e.length){K();return}let t=ce(e);if(!t.length){K();return}L(),t.forEach(ye)},Q=async()=>await k.get(),De=async e=>await k.getById(e),Oe=async e=>await k.create(e),ke=async(e,t)=>await k.update(e,t),Ae=async e=>await k.delete(e);R(!0);var $=[];te.addEventListener(`click`,async()=>{let e=ee.value.trim();if(q(d,``),!V(e)){q(d,`Debe ingresar un documento`),G(`Debe ingresar un documento`);return}try{z();let{user:t,tasks:n}=await ie(e);i(t),B(t),R(!1),W(`Usuario encontrado correctamente`),$=n,$.length>0?Z($):(z(),K())}catch(e){R(!0),xe(f,`
            <div class="message-card__content">❌ ${e.message}</div>
        `),G(e.message),z(),K(),console.error(e)}}),p.addEventListener(`submit`,async e=>{e.preventDefault();let t=m.value.trim(),n=g.value.trim(),i=v.value,a=l();if(q(h,``),q(_,``),q(y,``),!V(t)){q(h,`Debe ingresar un título`),G(`Debe ingresar un título`);return}if(!V(n)){q(_,`Debe ingresar una descripción`),G(`Debe ingresar una descripción`);return}if(!V(i)){q(y,`Debe seleccionar un estado`),G(`Debe seleccionar un estado`);return}try{if(a){let e=await oe(a,{title:t,description:n,status:i}),r=$.findIndex(t=>t.id==e.id);r!==-1&&($[r]=e),Z($),u(null),p.reset(),q(p.querySelector(`button[type="submit"]`),`Guardar Tarea`),W(`Tarea actualizada correctamente`)}else{let e=await ae({userId:r().id,title:t,description:n,status:i});$.push(e),Z($),p.reset(),W(`Tarea registrada correctamente`)}}catch(e){G(e.message)}}),b.addEventListener(`click`,e=>{let t=e.target.closest(`.btnUpdate`);if(!t)return;e.preventDefault();let n=t.getAttribute(`data-id`),r=t.closest(`.message-card`);if(!r)return;let i=q(r.querySelector(`.message-card__title`)).replace(`Tarea: `,``).trim(),a=q(r.querySelector(`.message-card__content`)).trim();m.value=i,g.value=a,v.value=``,u(n),q(p.querySelector(`button[type="submit"]`),`Actualizar Tarea`),p.scrollIntoView({behavior:`smooth`,block:`center`}),m.focus()}),b.addEventListener(`click`,async e=>{let t=e.target.closest(`.btnDelete`);if(!t)return;e.preventDefault();let n=t.getAttribute(`data-id`);try{await se(n),$=$.filter(e=>e.id!=n),Z($),W(`Tarea eliminada correctamente`)}catch(e){G(e.message)}}),S.addEventListener(`input`,()=>Z($)),C.addEventListener(`change`,()=>Z($)),document.addEventListener(`change`,e=>{let t=e.target.closest(`#status-order`);if(!t)return;let n=t.value||`date`,r=F();r.length&&P(r,n).forEach(e=>{b.appendChild(e.element)})}),w.addEventListener(`click`,Te),adminHeader.addEventListener(`click`,async()=>{if(X(adminPanel,adminArrow),!adminPanel.classList.contains(`hidden`))try{Y(await Q(),adminUsersList)}catch(e){G(`Error al cargar usuarios: `+e.message)}}),btnAdminSearch.addEventListener(`click`,async()=>{let e=adminUserDoc.value.trim();if(q(adminSearchError,``),!V(e)){q(adminSearchError,`Debe ingresar un documento`),G(`Debe ingresar un documento`);return}try{Ee(await De(e),adminUsersList),W(`Usuario encontrado`)}catch(e){q(adminSearchError,e.message),G(e.message)}}),btnAdminCreate.addEventListener(`click`,async()=>{let e=T.value.trim(),t=adminUserName.value.trim(),n=adminUserEmail.value.trim();if(q(E,``),q(adminNameError,``),q(adminEmailError,``),!V(e)){q(E,`Debe ingresar un documento`),G(`Debe ingresar un documento`);return}if(!V(t)){q(adminNameError,`Debe ingresar un nombre`),G(`Debe ingresar un nombre`);return}if(!V(n)){q(adminEmailError,`Debe ingresar un correo`),G(`Debe ingresar un correo`);return}try{await Oe({id:e,name:t,email:n}),W(`Usuario creado correctamente`),T.value=``,adminUserName.value=``,adminUserEmail.value=``,Y(await Q(),adminUsersList)}catch(e){G(e.message)}}),adminUsersList.addEventListener(`click`,async e=>{let t=e.target.closest(`.btn-admin-update`);if(t){let e=t.getAttribute(`data-id`),n=t.getAttribute(`data-name`),r=t.getAttribute(`data-email`),i=prompt(`Nombre actual: `+n+`
Nuevo nombre:`,n);if(i===null)return;let a=prompt(`Correo actual: `+r+`
Nuevo correo:`,r);if(a===null)return;try{await ke(e,{name:i,email:a}),W(`Usuario actualizado correctamente`),Y(await Q(),adminUsersList)}catch(e){G(e.message)}return}let n=e.target.closest(`.btn-admin-delete`);if(n){let e=n.getAttribute(`data-id`);if(!confirm(`¿Está seguro de eliminar este usuario?`))return;try{await Ae(e),W(`Usuario eliminado correctamente`),Y(await Q(),adminUsersList)}catch(e){G(e.message)}}});