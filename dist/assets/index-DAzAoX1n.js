(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=`http://localhost:3000/api`,t=null,n=0,r=()=>t,i=e=>{t=e},a=()=>n,o=()=>{n++},s=()=>{n=0},c=null,ee=()=>c,te=e=>{c=e},ne=document.getElementById(`user-doc`),re=document.getElementById(`btn-search`),ie=document.getElementById(`search-error`),ae=document.getElementById(`user-info-display`),l=document.getElementById(`task-form`),u=document.getElementById(`task-title`),oe=document.getElementById(`title-error`),se=document.getElementById(`task-desc`),d=document.getElementById(`desc-error`),ce=document.getElementById(`task-status`),le=document.getElementById(`status-error`),f=document.getElementById(`tasks-table`),p=document.getElementById(`task-count`),m=document.getElementById(`filter-title`),h=document.getElementById(`filter-status`),ue=document.getElementById(`btn-export`),g=document.getElementById(`user-tasks-section`),_=document.getElementById(`task-users`),de=document.getElementById(`users-error`),v=document.getElementById(`selected-users`),fe=document.querySelectorAll(`.nav__tab`);document.getElementById(`view-users`),document.getElementById(`view-admin`),document.getElementById(`view-tasks`);var y=document.getElementById(`user-form`),b=document.getElementById(`user-form-name`),x=document.getElementById(`user-form-email`),S=document.getElementById(`user-form-name-error`),pe=document.getElementById(`user-form-email-error`),me=document.getElementById(`users-table`),he=document.getElementById(`user-form-submit`),C=document.getElementById(`admin-tasks-container`),w=document.getElementById(`admin-task-count`),T=document.getElementById(`admin-filter-status`),E=document.getElementById(`admin-filter-user`),D=async(e,t={})=>{let n;try{n=await fetch(e,t)}catch{throw Error(`Servicio no disponible`)}if(n.ok)return await n.json();let r=`Error (Código: ${n.status})`;try{let e=await n.json();e?.error&&(r=e.error)}catch{}let i=Error(r);throw i.status=n.status,i},O=`${e}/users`,k={get:async()=>await D(O),getById:async e=>await D(`${O}/${e}`),create:async e=>await D(O,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify(e)}),update:async(e,t)=>await D(`${O}/${e}`,{method:`PATCH`,headers:{"Content-Type":`application/json`},body:JSON.stringify(t)}),delete:async e=>await D(`${O}/${e}`,{method:`DELETE`})},A=`${e}/assignments`,ge=`${e}/tasks`,_e=`${e}/users`,j={get:async()=>await D(A),getById:async e=>await D(`${A}/${e}`),getByTaskId:async e=>await D(`${ge}/${e}/users`),getByUserId:async e=>await D(`${_e}/${e}/tasks`),create:async e=>await D(A,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify(e)}),delete:async e=>await D(`${A}/${e}`,{method:`DELETE`})},ve=async e=>{let t=await k.getById(e);return{user:t,tasks:await j.getByUserId(t.id)}},M=`${e}/tasks`,N={get:async()=>await D(M),getById:async e=>await D(`${M}/${e}`),create:async e=>await D(M,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify(e)}),update:async(e,t)=>await D(`${M}/${e}`,{method:`PATCH`,headers:{"Content-Type":`application/json`},body:JSON.stringify(t)}),delete:async e=>await D(`${M}/${e}`,{method:`DELETE`})},P=e=>new Promise(t=>setTimeout(t,e)),ye=async e=>{let{userIds:t,...n}=e,r=await N.create(n);for(let e of t)await j.create({taskId:r.id,userId:e}),await P(100);return r},be=async(e,t)=>await N.update(e,t),xe=async(e,t)=>{let{userIds:n,...r}=t,i=(await j.get()).filter(t=>t.taskId===e),a=i.map(e=>e.userId),o=n.filter(e=>!a.includes(e)),s=i.filter(e=>!n.includes(e.userId));for(let t of o)await j.create({taskId:e,userId:t}),await P(100);for(let e of s)await j.delete(e.id),await P(100);return await N.update(e,r)},Se=async e=>await N.delete(e),Ce=e=>{let t=h.value,n=m.value.toLowerCase().trim();return e.filter(e=>{let r=t===`todos`||e.status===t,i=e.title.toLowerCase().includes(n);return r&&i})},we=(e,t,n)=>e.filter(e=>{let r=t===`todos`||e.status===t,i=!0;return n!==`todos`&&(i=(e.assignedUsers||[]).some(e=>e.id==n)),r&&i}),Te=e=>[...e].sort((e,t)=>new Date(e.date)-new Date(t.date)),Ee=e=>[...e].sort((e,t)=>e.title.localeCompare(t.title)),De=(e,t)=>[...e].sort((e,n)=>e.status===t&&n.status!==t?-1:+(e.status!==t&&n.status===t)),Oe=(e,t)=>!t||t===`date`?Te(e):t===`name`?Ee(e):t===`pendiente`||t===`en-progreso`||t===`completada`?De(e,t):e,ke=()=>{let e=document.querySelectorAll(`#tasks-table > .message-card`);return Array.from(e).map(e=>({id:e.id,title:e.querySelector(`.message-card__title`).textContent,description:e.querySelector(`.message-card__content`).textContent,status:e.querySelector(`.task-badge`).className.match(/task-badge--(\S+)/)[1],date:e.dataset.date||``,element:e}))},Ae=`
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
`,je=async()=>{let e=document.querySelector(`.card__order-bar`);e&&e.remove(),f.insertAdjacentHTML(`beforebegin`,Ae)},F=e=>{l.querySelectorAll(`input, textarea, select, button`).forEach(t=>{t.disabled=e})},I=()=>{f.innerHTML=``,s(),p.textContent=`0 Tareas`},Me=e=>{ae.innerHTML=`
    
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
    `},L=e=>e!=null&&e.trim()!==``,R={SUCCESS:`success`,ERROR:`error`,INFO:`info`},Ne={[R.SUCCESS]:`✅`,[R.ERROR]:`❌`,[R.INFO]:`ℹ️`},Pe=e=>(e||(e=document.getElementById(`notifications-container`),e||(e=document.createElement(`div`),e.id=`notifications-container`,document.body.appendChild(e))),e),z=(e,t=R.INFO,n=1e3)=>{let r=document.createElement(`div`);return r.className=`notification notification--${t}`,r.setAttribute(`role`,`alert`),r.innerHTML=`
        <span class="notification__icon">${Ne[t]}</span>
        <span class="notification__message">${e}</span>
    `,Pe().appendChild(r),setTimeout(()=>Fe(r),n),r},Fe=e=>{!e||e.classList.contains(`notification--dismissing`)||(e.classList.add(`notification--dismissing`),e.addEventListener(`animationend`,()=>e.remove(),{once:!0}))},B=e=>z(e,R.SUCCESS),V=e=>z(e,R.ERROR),Ie=e=>z(e,R.INFO),Le={pendiente:`Pendiente`,"en-progreso":`En Progreso`,completada:`Completada`},H=e=>Le[e]||`Sin estado`,Re=(e,t=`tareas.json`)=>{let n=JSON.stringify(e,null,2),r=new Blob([n],{type:`application/json`}),i=URL.createObjectURL(r),a=document.createElement(`a`);a.href=i,a.download=t,a.click(),URL.revokeObjectURL(i)},ze=e=>{let t=document.querySelector(`.messages-empty`);t&&t.remove();let n=document.createElement(`div`);n.classList.add(`message-card`),e.id&&(n.id=`${e.id}`),e.date&&(n.dataset.date=e.date);let i=H(e.status),s=r()?.name||`Usuario`;n.innerHTML=`
    
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
            ${e.status===`completada`?``:`<button type="button" class="btn btn--success btnComplete" data-id="${e.id}">
                        Completar
                    </button>`}
            <button type="button" class="btn btn--secondary btnUpdate" data-id="${e.id}">
                Actualizar
            </button>
            <button type="button" class="btn btn--secondary btnDelete" data-id="${e.id}">
                Eliminar
            </button>
        </div>
    `,f.prepend(n),o(),p.textContent=`${a()} Tareas`},Be=()=>{let e=document.querySelector(`.card__order-bar`);e&&e.remove()},U=()=>{Be(),f.innerHTML=`
        <div class="messages-empty">
            <div class="messages-empty__icon">📋</div>
            <p class="messages-empty__text">El usuario no tiene tareas</p>
            <p class="messages-empty__subtext">Registre una nueva tarea.</p>
        </div>
    `},W=(e,t)=>{e.innerHTML=t},G=(e,t)=>{if(t===void 0)return e.textContent;e.textContent=t},Ve=`task-badge--`,He=e=>{let t=e.className.split(` `);for(let e of t)if(e.startsWith(Ve))return e.slice(12);return`sin-estado`},Ue=()=>{let e=f.querySelectorAll(`.message-card`);return e.length?Array.from(e).map(e=>{let t=e.querySelector(`.message-card__title`)?.textContent.trim()||``,n=e.querySelector(`.message-card__content`)?.textContent.trim()||``,r=e.querySelector(`.task-badge`),i=r?He(r):`sin-estado`;return{id:e.id,title:t,description:n,status:i}}):[]},We=()=>{let e=Ue();if(!e.length){Ie(`No hay tareas visibles para exportar`);return}Re(e,`tareas.json`)},K=[],Ge=!1,Ke=async()=>{if(!Ge){Ge=!0;try{_.innerHTML=`<option value="">Asignar a usuarios</option>`+(await k.get()).map(e=>`<option value="${e.id}">${e.name}</option>`).join(``)}catch{_.innerHTML=`<option value="">Error al cargar usuarios</option>`}}},qe=()=>K.map(e=>e.id),Je=()=>{K=[],q()},Ye=e=>{K=e.map(e=>({id:e.id,name:e.name})),q()},q=()=>{v.innerHTML=K.map(e=>`<span class="user-chip" data-initial="${e.name.charAt(0).toUpperCase()}">
            ${e.name}
            <button type="button" class="user-chip__remove" data-value="${e.id}">&times;</button>
        </span>`).join(``)};_.addEventListener(`focus`,Ke),_.addEventListener(`change`,()=>{let e=_.selectedOptions[0];!e||!e.value||(K.some(t=>t.id===e.value)||K.push({id:e.value,name:e.textContent}),_.value=``,q())}),v.addEventListener(`click`,e=>{let t=e.target.closest(`.user-chip__remove`);t&&(K=K.filter(e=>e.id!==t.dataset.value),q())});var Xe=(e,t,{onEdit:n,onDelete:r})=>{let i=Array.isArray(e)?e:[];if(!i.length){W(t,`
            <div class="messages-empty">
                <div class="messages-empty__icon">👥</div>
                <p class="messages-empty__text">No hay usuarios registrados</p>
                <p class="messages-empty__subtext">Registre un nuevo usuario para comenzar.</p>
            </div>
        `);return}W(t,i.map(e=>{let t=e.name?e.name.charAt(0).toUpperCase():`?`;return`
            <div class="message-card user-card" data-user-id="${e.id}">
                <div class="message-card__header">
                    <div class="message-card__user">
                        <div class="message-card__avatar">${t}</div>
                        <div>
                            <div class="message-card__username">${e.name}</div>
                            <div class="message-card__title">${e.email||`Sin email`}</div>
                        </div>
                    </div>
                    <span class="user-card__date">
                        ${e.date?new Date(e.date).toLocaleDateString(`es-CO`):``}
                    </span>
                </div>
                <div class="message-card__body">
                    <div class="message-card__content">
                        ID: ${e.id}
                    </div>
                    <button type="button" class="btn btn--secondary btn--sm btn-edit-user" data-id="${e.id}">
                        Editar
                    </button>
                    <button type="button" class="btn btn--secondary btn--sm btn-delete-user" data-id="${e.id}">
                        Eliminar
                    </button>
                </div>
            </div>
        `}).join(``)),t.querySelectorAll(`.btn-edit-user`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.getAttribute(`data-id`),r=i.find(e=>e.id==t);r&&n(r)})}),t.querySelectorAll(`.btn-delete-user`).forEach(e=>{e.addEventListener(`click`,()=>{r(e.getAttribute(`data-id`))})})},Ze=(e,t)=>{let n=Array.isArray(e)?e:[];if(!n.length){W(t,`
            <div class="messages-empty">
                <div class="messages-empty__icon">📋</div>
                <p class="messages-empty__text">No hay tareas registradas</p>
                <p class="messages-empty__subtext">No se encontraron tareas en el sistema.</p>
            </div>
        `);return}W(t,n.map(e=>{let t=H(e.status),n=(e.assignedUsers||[]).map(e=>e.name).join(`, `),r=n||`Sin asignar`,i=n?n.charAt(0).toUpperCase():`?`;return`
            <div class="message-card admin-task-card" data-task-id="${e.id}">
                <div class="message-card__header">
                    <div class="message-card__user">
                        <div class="message-card__avatar">${i}</div>
                        <div>
                            <div class="message-card__username">${e.title}</div>
                            <div class="message-card__title">Asignado: ${r}</div>
                        </div>
                    </div>
                    <span class="task-badge task-badge--${e.status}">
                        ${t}
                    </span>
                </div>
                <div class="message-card__body">
                    <div class="message-card__content">
                        ${e.description||`Sin descripción`}
                    </div>
                </div>
            </div>
        `}).join(``))},J=e=>{if(I(),!e.length){U();return}let t=Ce(e);if(!t.length){U();return}je(),t.forEach(ze)},Qe=async()=>await k.get(),$e=async e=>{let t={...e,date:new Date().toISOString()};return await k.create(t)},et=async(e,t)=>await k.update(e,t),tt=async e=>await k.delete(e),nt=async()=>{let[e,t,n]=await Promise.all([N.get(),j.get(),k.get()]),r=Array.isArray(e)?e:[],i=Array.isArray(t)?t:[],a=Array.isArray(n)?n:[],o={};return a.forEach(e=>{o[e.id]=e}),r.map(e=>{let t=i.filter(t=>t.taskId==e.id||t.task_id==e.id).map(e=>{let t=e.userId||e.user_id;return o[t]}).filter(Boolean);return{...e,assignedUsers:t}})},Y=[],X=[],Z=null,Q=[];function rt(e){document.querySelectorAll(`.view`).forEach(e=>{e.style.display=`none`}),fe.forEach(e=>{e.classList.remove(`nav__tab--active`)});let t=document.getElementById(e);t&&(t.style.display=``);let n=document.querySelector(`[data-view="${e}"]`);n&&n.classList.add(`nav__tab--active`),e===`view-users`?$():e===`view-admin`&&ot()}fe.forEach(e=>{e.addEventListener(`click`,()=>{rt(e.getAttribute(`data-view`))})});async function $(){try{X=await Qe();let e=Array.isArray(X)?X:[],t=document.getElementById(`users-count`);t&&(t.textContent=`${e.length} Usuarios`),Xe(e,me,{onEdit:it,onDelete:at})}catch(e){V(e.message)}}y.addEventListener(`submit`,async e=>{e.preventDefault();let t=b.value.trim(),n=x.value.trim();if(G(S,``),G(pe,``),!L(t)){G(S,`Debe ingresar un nombre`),V(`Debe ingresar un nombre`);return}if(!L(n)){G(pe,`Debe ingresar un email`),V(`Debe ingresar un email`);return}try{Z?(await et(Z,{name:t,email:n}),B(`Usuario actualizado correctamente`),Z=null,b.value=``,x.value=``,G(he,`Guardar Usuario`),G(document.getElementById(`user-form-title`),`Registrar Nuevo Usuario`)):(await $e({name:t,email:n}),B(`Usuario registrado correctamente`),y.reset()),$()}catch(e){V(e.message)}});function it(e){Z=e.id,b.value=e.name,x.value=e.email||``,G(he,`Actualizar Usuario`),G(document.getElementById(`user-form-title`),`Actualizar Usuario`),y.scrollIntoView({behavior:`smooth`,block:`center`}),b.focus()}async function at(e){try{await tt(e),B(`Usuario eliminado correctamente`),$()}catch(e){V(e.message)}}async function ot(){try{Q=await nt();let e=Array.isArray(Q)?Q:[];w.textContent=`${e.length} Tareas`;let t={};e.forEach(e=>{(e.assignedUsers||[]).forEach(e=>{t[e.id]=e})});let n=Object.values(t);E.innerHTML=`<option value="todos">Todos los usuarios</option>`,n.forEach(e=>{let t=document.createElement(`option`);t.value=e.id,t.textContent=e.name,E.appendChild(t)}),Ze(e,C)}catch(e){V(e.message)}}function st(){let e=T.value,t=E.value,n=we(Q,e,t);w.textContent=`${n.length} Tareas`,Ze(n,C)}T.addEventListener(`change`,st),E.addEventListener(`change`,st),re.addEventListener(`click`,async()=>{let e=ne.value.trim();if(G(ie,``),!L(e)){G(ie,`Debe ingresar un documento`),V(`Debe ingresar un documento`);return}try{I();let{user:t,tasks:n}=await ve(e);i(t),Me(t),F(!1),g.style.display=``,B(`Usuario encontrado correctamente`),Y=n,Y.length>0?J(Y):(I(),U())}catch(e){F(!0),g.style.display=`none`,W(ae,`
            <div class="message-card__content">❌ ${e.message}</div>
        `),V(e.message),I(),U(),console.error(e)}}),l.addEventListener(`submit`,async e=>{e.preventDefault();let t=u.value.trim(),n=se.value.trim(),r=ce.value,i=ee();if(G(oe,``),G(d,``),G(le,``),G(de,``),!L(t)){G(oe,`Debe ingresar un título`),V(`Debe ingresar un título`);return}if(!L(n)){G(d,`Debe ingresar una descripción`),V(`Debe ingresar una descripción`);return}if(!L(r)){G(le,`Debe seleccionar un estado`),V(`Debe seleccionar un estado`);return}let a=qe();if(!a.length){G(de,`Debe seleccionar al menos un usuario`),V(`Debe seleccionar al menos un usuario`);return}try{if(i){let e=await xe(i,{userIds:a,title:t,description:n,status:r}),o=Y.findIndex(t=>t.id==e.id);o!==-1&&(Y[o]=e),J(Y),te(null),l.reset(),Je(),G(l.querySelector(`button[type="submit"]`),`Guardar Tarea`),B(`Tarea actualizada correctamente`)}else{let e=await ye({userIds:a,title:t,description:n,status:r});Y.push(e),J(Y),l.reset(),Je(),B(`Tarea registrada correctamente`)}}catch(e){V(e.message)}}),f.addEventListener(`click`,async e=>{let t=e.target.closest(`.btnUpdate`);if(!t)return;e.preventDefault();let n=t.getAttribute(`data-id`),r=t.closest(`.message-card`);if(!r)return;let i=G(r.querySelector(`.message-card__title`)).replace(`Tarea: `,``).trim(),a=G(r.querySelector(`.message-card__content`)).trim();u.value=i,se.value=a,ce.value=``,te(n);try{Ye(await j.getByTaskId(n))}catch{}G(l.querySelector(`button[type="submit"]`),`Actualizar Tarea`),l.scrollIntoView({behavior:`smooth`,block:`center`}),u.focus()}),f.addEventListener(`click`,async e=>{let t=e.target.closest(`.btnDelete`);if(!t)return;e.preventDefault();let n=t.getAttribute(`data-id`);try{await Se(n),Y=Y.filter(e=>e.id!=n),J(Y),B(`Tarea eliminada correctamente`)}catch(e){V(e.message)}}),f.addEventListener(`click`,async e=>{let t=e.target.closest(`.btnComplete`);if(!t)return;e.preventDefault();let n=t.getAttribute(`data-id`);try{await be(n,{status:`completada`});let e=Y.find(e=>e.id==n);e&&(e.status=`completada`),J(Y),B(`Tarea marcada como completada`)}catch(e){V(e.message)}}),m.addEventListener(`input`,()=>J(Y)),h.addEventListener(`change`,()=>J(Y)),document.addEventListener(`change`,e=>{let t=e.target.closest(`#status-order`);if(!t)return;let n=t.value||`date`,r=ke();r.length&&Oe(r,n).forEach(e=>{f.appendChild(e.element)})}),ue.addEventListener(`click`,We),$();