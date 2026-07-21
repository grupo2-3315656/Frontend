(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=`http://localhost:3000/api`,t=null,n=0,r=()=>t,i=e=>{t=e},a=()=>n,o=()=>{n++},s=()=>{n=0},c=null,ee=()=>c,l=e=>{c=e},te=document.getElementById(`user-doc`),ne=document.getElementById(`btn-search`),re=document.getElementById(`search-error`),ie=document.getElementById(`user-info-display`),u=document.getElementById(`task-form`),d=document.getElementById(`task-title`),f=document.getElementById(`title-error`),p=document.getElementById(`task-desc`),m=document.getElementById(`desc-error`),h=document.getElementById(`task-status`),g=document.getElementById(`status-error`),_=document.getElementById(`tasks-table`),v=document.getElementById(`task-count`),y=document.getElementById(`filter-title`),b=document.getElementById(`filter-status`),ae=document.getElementById(`btn-export`),x=document.getElementById(`user-tasks-section`),S=document.getElementById(`task-users`),oe=document.getElementById(`users-error`),se=document.getElementById(`selected-users`),ce=document.querySelectorAll(`.nav__tab`);document.getElementById(`view-users`),document.getElementById(`view-admin`),document.getElementById(`view-tasks`);var C=document.getElementById(`user-form`),w=document.getElementById(`user-form-name`),T=document.getElementById(`user-form-email`),le=document.getElementById(`user-form-name-error`),ue=document.getElementById(`user-form-email-error`),de=document.getElementById(`users-table`),fe=document.getElementById(`user-form-submit`),pe=document.getElementById(`admin-tasks-container`),me=document.getElementById(`admin-task-count`),he=document.getElementById(`admin-filter-status`),E=document.getElementById(`admin-filter-user`),D=async(e,t={})=>{let n;try{console.log(`📡 fetch →`,t.method||`GET`,e),n=await fetch(e,t)}catch(e){throw console.error(`❌ Network error:`,e.message),Error(`Servicio no disponible`)}if(console.log(`📨 Response status:`,n.status),n.ok){let e=await n.json();return console.log(`✅ Response data:`,e),e}let r=`Error (Código: ${n.status})`;try{let e=await n.json();console.error(`❌ Error body:`,e),e?.error&&(r=e.error)}catch{}let i=Error(r);throw i.status=n.status,i},O=`${e}/users`,k={get:async()=>await D(O),getById:async e=>await D(`${O}/${e}`),create:async e=>await D(O,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify(e)}),update:async(e,t)=>await D(`${O}/${e}`,{method:`PATCH`,headers:{"Content-Type":`application/json`},body:JSON.stringify(t)}),delete:async e=>await D(`${O}/${e}`,{method:`DELETE`})},A=`${e}/assignments`,ge=`${e}/tasks`,_e=`${e}/users`,j={get:async()=>await D(A),getById:async e=>await D(`${A}/${e}`),getByTaskId:async e=>await D(`${ge}/${e}/users`),getByUserId:async e=>await D(`${_e}/${e}/tasks`),create:async e=>(console.log(`🌐 POST /api/assignments body:`,JSON.stringify(e)),await D(A,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify(e)})),delete:async e=>await D(`${A}/${e}`,{method:`DELETE`})},ve=async e=>{let t=await k.getById(e);return{user:t,tasks:await j.getByUserId(t.id)}},M=`${e}/tasks`,N={get:async()=>await D(M),getById:async e=>await D(`${M}/${e}`),create:async e=>await D(M,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify(e)}),update:async(e,t)=>await D(`${M}/${e}`,{method:`PATCH`,headers:{"Content-Type":`application/json`},body:JSON.stringify(t)}),delete:async e=>await D(`${M}/${e}`,{method:`DELETE`})},ye=async e=>{let{userIds:t,...n}=e;console.log(`📝 taskData recibido:`,e),console.log(`📋 taskPayload:`,n),console.log(`👥 userIds:`,t);let r=await N.create(n);console.log(`✅ Tarea creada:`,r);for(let e of t){let t={taskId:r.id,userId:e};console.log(`🔗 Creando asignación:`,t),await j.create(t)}return r},be=async(e,t)=>await N.update(e,t),xe=async(e,t)=>{let{userIds:n,...r}=t,i=(await j.get()).filter(t=>t.taskId===e),a=i.map(e=>e.userId),o=n.filter(e=>!a.includes(e)),s=i.filter(e=>!n.includes(e.userId));for(let t of o)await j.create({taskId:e,userId:t});for(let e of s)await j.delete(e.id);return await N.update(e,r)},Se=async e=>await N.delete(e),Ce=e=>{let t=b.value,n=y.value.toLowerCase().trim();return e.filter(e=>{let r=t===`todos`||e.status===t,i=e.title.toLowerCase().includes(n);return r&&i})},we=(e,t,n)=>e.filter(e=>{let r=t===`todos`||e.status===t,i=!0;return n!==`todos`&&(i=(e.assignedUsers||[]).some(e=>e.id==n)),r&&i}),Te=e=>[...e].sort((e,t)=>new Date(e.date)-new Date(t.date)),Ee=e=>[...e].sort((e,t)=>e.title.localeCompare(t.title)),De=(e,t)=>[...e].sort((e,n)=>e.status===t&&n.status!==t?-1:+(e.status!==t&&n.status===t)),Oe=(e,t)=>!t||t===`date`?Te(e):t===`name`?Ee(e):t===`pendiente`||t===`en-progreso`||t===`completada`?De(e,t):e,ke=()=>{let e=document.querySelectorAll(`#tasks-table > .message-card`);return Array.from(e).map(e=>({id:e.id,title:e.querySelector(`.message-card__title`).textContent,description:e.querySelector(`.message-card__content`).textContent,status:e.querySelector(`.task-badge`).className.match(/task-badge--(\S+)/)[1],date:e.dataset.date||``,element:e}))},Ae=`
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
`,je=async()=>{let e=document.querySelector(`.card__order-bar`);e&&e.remove(),_.insertAdjacentHTML(`beforebegin`,Ae)},P=e=>{u.querySelectorAll(`input, textarea, select, button`).forEach(t=>{t.disabled=e})},F=()=>{_.innerHTML=``,s(),v.textContent=`0 Tareas`},Me=e=>{ie.innerHTML=`
    
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
    `},I=e=>e!=null&&e.trim()!==``,L={SUCCESS:`success`,ERROR:`error`,INFO:`info`},Ne={[L.SUCCESS]:`✅`,[L.ERROR]:`❌`,[L.INFO]:`ℹ️`},Pe=e=>(e||(e=document.getElementById(`notifications-container`),e||(e=document.createElement(`div`),e.id=`notifications-container`,document.body.appendChild(e))),e),R=(e,t=L.INFO,n=1e3)=>{let r=document.createElement(`div`);return r.className=`notification notification--${t}`,r.setAttribute(`role`,`alert`),r.innerHTML=`
        <span class="notification__icon">${Ne[t]}</span>
        <span class="notification__message">${e}</span>
    `,Pe().appendChild(r),setTimeout(()=>Fe(r),n),r},Fe=e=>{!e||e.classList.contains(`notification--dismissing`)||(e.classList.add(`notification--dismissing`),e.addEventListener(`animationend`,()=>e.remove(),{once:!0}))},z=e=>R(e,L.SUCCESS),B=e=>R(e,L.ERROR),Ie=e=>R(e,L.INFO),Le={pendiente:`Pendiente`,"en-progreso":`En Progreso`,completada:`Completada`},V=e=>Le[e]||`Sin estado`,Re=(e,t=`tareas.json`)=>{let n=JSON.stringify(e,null,2),r=new Blob([n],{type:`application/json`}),i=URL.createObjectURL(r),a=document.createElement(`a`);a.href=i,a.download=t,a.click(),URL.revokeObjectURL(i)},ze=e=>{let t=document.querySelector(`.messages-empty`);t&&t.remove();let n=document.createElement(`div`);n.classList.add(`message-card`),e.id&&(n.id=`${e.id}`),e.date&&(n.dataset.date=e.date);let i=V(e.status),s=r()?.name||`Usuario`;n.innerHTML=`
    
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
    `,_.prepend(n),o(),v.textContent=`${a()} Tareas`},Be=()=>{let e=document.querySelector(`.card__order-bar`);e&&e.remove()},H=()=>{Be(),_.innerHTML=`
        <div class="messages-empty">
            <div class="messages-empty__icon">📋</div>
            <p class="messages-empty__text">El usuario no tiene tareas</p>
            <p class="messages-empty__subtext">Registre una nueva tarea.</p>
        </div>
    `},U=(e,t)=>{e.innerHTML=t},W=(e,t)=>{if(t===void 0)return e.textContent;e.textContent=t},Ve=`task-badge--`,He=e=>{let t=e.className.split(` `);for(let e of t)if(e.startsWith(Ve))return e.slice(12);return`sin-estado`},Ue=()=>{let e=_.querySelectorAll(`.message-card`);return e.length?Array.from(e).map(e=>{let t=e.querySelector(`.message-card__title`)?.textContent.trim()||``,n=e.querySelector(`.message-card__content`)?.textContent.trim()||``,r=e.querySelector(`.task-badge`),i=r?He(r):`sin-estado`;return{id:e.id,title:t,description:n,status:i}}):[]},We=()=>{let e=Ue();if(!e.length){Ie(`No hay tareas visibles para exportar`);return}Re(e,`tareas.json`)},G=[],Ge=!1,Ke=async()=>{if(!Ge){Ge=!0;try{S.innerHTML=`<option value="">Asignar a usuarios</option>`+(await k.get()).map(e=>`<option value="${e.id}">${e.name}</option>`).join(``)}catch{S.innerHTML=`<option value="">Error al cargar usuarios</option>`}}},qe=()=>G.map(e=>e.id),Je=()=>{G=[],K()},Ye=e=>{G=e.map(e=>({id:e.id,name:e.name})),K()},K=()=>{se.innerHTML=G.map(e=>`<span class="user-chip" data-initial="${e.name.charAt(0).toUpperCase()}">
            ${e.name}
            <button type="button" class="user-chip__remove" data-value="${e.id}">&times;</button>
        </span>`).join(``)};S.addEventListener(`focus`,Ke),S.addEventListener(`change`,()=>{let e=S.selectedOptions[0];!e||!e.value||(G.some(t=>t.id===e.value)||G.push({id:e.value,name:e.textContent}),S.value=``,K())}),se.addEventListener(`click`,e=>{let t=e.target.closest(`.user-chip__remove`);t&&(G=G.filter(e=>e.id!==t.dataset.value),K())});var Xe=(e,t,{onEdit:n,onDelete:r})=>{let i=Array.isArray(e)?e:[];if(!i.length){U(t,`
            <div class="messages-empty">
                <div class="messages-empty__icon">👥</div>
                <p class="messages-empty__text">No hay usuarios registrados</p>
                <p class="messages-empty__subtext">Registre un nuevo usuario para comenzar.</p>
            </div>
        `);return}U(t,i.map(e=>{let t=e.name?e.name.charAt(0).toUpperCase():`?`;return`
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
        `}).join(``)),t.querySelectorAll(`.btn-edit-user`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.getAttribute(`data-id`),r=i.find(e=>e.id==t);r&&n(r)})}),t.querySelectorAll(`.btn-delete-user`).forEach(e=>{e.addEventListener(`click`,()=>{r(e.getAttribute(`data-id`))})})},q=(e,t)=>{let n=Array.isArray(e)?e:[];if(!n.length){U(t,`
            <div class="messages-empty">
                <div class="messages-empty__icon">📋</div>
                <p class="messages-empty__text">No hay tareas registradas</p>
                <p class="messages-empty__subtext">No se encontraron tareas en el sistema.</p>
            </div>
        `);return}U(t,n.map(e=>{let t=V(e.status),n=(e.assignedUsers||[]).map(e=>e.name).join(`, `),r=n||`Sin asignar`,i=n?n.charAt(0).toUpperCase():`?`;return`
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
        `}).join(``))},J=e=>{if(F(),!e.length){H();return}let t=Ce(e);if(!t.length){H();return}je(),t.forEach(ze)},Ze=async()=>await k.get(),Qe=async e=>{let t={...e,date:new Date().toISOString()};return await k.create(t)},$e=async(e,t)=>await k.update(e,t),et=async e=>await k.delete(e),tt=async()=>{let[e,t,n]=await Promise.all([N.get(),j.get(),k.get()]),r=Array.isArray(e)?e:[],i=Array.isArray(t)?t:[],a=Array.isArray(n)?n:[],o={};return a.forEach(e=>{o[e.id]=e}),r.map(e=>{let t=i.filter(t=>t.taskId==e.id||t.task_id==e.id).map(e=>{let t=e.userId||e.user_id;return o[t]}).filter(Boolean);return{...e,assignedUsers:t}})},Y=[],X=[],Z=null,Q=[];function nt(e){document.querySelectorAll(`.view`).forEach(e=>{e.style.display=`none`}),ce.forEach(e=>{e.classList.remove(`nav__tab--active`)});let t=document.getElementById(e);t&&(t.style.display=``);let n=document.querySelector(`[data-view="${e}"]`);n&&n.classList.add(`nav__tab--active`),e===`view-users`?$():e===`view-admin`&&at()}ce.forEach(e=>{e.addEventListener(`click`,()=>{nt(e.getAttribute(`data-view`))})});async function $(){try{X=await Ze();let e=Array.isArray(X)?X:[],t=document.getElementById(`users-count`);t&&(t.textContent=`${e.length} Usuarios`),Xe(e,de,{onEdit:rt,onDelete:it})}catch(e){B(e.message)}}C.addEventListener(`submit`,async e=>{e.preventDefault();let t=w.value.trim(),n=T.value.trim();if(W(le,``),W(ue,``),!I(t)){W(le,`Debe ingresar un nombre`),B(`Debe ingresar un nombre`);return}if(!I(n)){W(ue,`Debe ingresar un email`),B(`Debe ingresar un email`);return}try{Z?(await $e(Z,{name:t,email:n}),z(`Usuario actualizado correctamente`),Z=null,w.value=``,T.value=``,W(fe,`Guardar Usuario`),W(document.getElementById(`user-form-title`),`Registrar Nuevo Usuario`)):(await Qe({name:t,email:n}),z(`Usuario registrado correctamente`),C.reset()),$()}catch(e){B(e.message)}});function rt(e){Z=e.id,w.value=e.name,T.value=e.email||``,W(fe,`Actualizar Usuario`),W(document.getElementById(`user-form-title`),`Actualizar Usuario`),C.scrollIntoView({behavior:`smooth`,block:`center`}),w.focus()}async function it(e){try{await et(e),z(`Usuario eliminado correctamente`),$()}catch(e){B(e.message)}}async function at(){try{Q=await tt();let e=Array.isArray(Q)?Q:[];me.textContent=`${e.length} Tareas`;let t={};e.forEach(e=>{(e.assignedUsers||[]).forEach(e=>{t[e.id]=e})});let n=Object.values(t);E.innerHTML=`<option value="todos">Todos los usuarios</option>`,n.forEach(e=>{let t=document.createElement(`option`);t.value=e.id,t.textContent=e.name,E.appendChild(t)}),q(e,pe)}catch(e){B(e.message)}}function ot(){let e=he.value,t=E.value,n=we(Q,e,t);me.textContent=`${n.length} Tareas`,q(n,pe)}he.addEventListener(`change`,ot),E.addEventListener(`change`,ot),ne.addEventListener(`click`,async()=>{let e=te.value.trim();if(W(re,``),!I(e)){W(re,`Debe ingresar un documento`),B(`Debe ingresar un documento`);return}try{F();let{user:t,tasks:n}=await ve(e);i(t),Me(t),P(!1),x.style.display=``,z(`Usuario encontrado correctamente`),Y=n,Y.length>0?J(Y):(F(),H())}catch(e){P(!0),x.style.display=`none`,U(ie,`
            <div class="message-card__content">❌ ${e.message}</div>
        `),B(e.message),F(),H(),console.error(e)}}),u.addEventListener(`submit`,async e=>{e.preventDefault();let t=d.value.trim(),n=p.value.trim(),r=h.value,i=ee();if(W(f,``),W(m,``),W(g,``),W(oe,``),!I(t)){W(f,`Debe ingresar un título`),B(`Debe ingresar un título`);return}if(!I(n)){W(m,`Debe ingresar una descripción`),B(`Debe ingresar una descripción`);return}if(!I(r)){W(g,`Debe seleccionar un estado`),B(`Debe seleccionar un estado`);return}let a=qe();if(!a.length){W(oe,`Debe seleccionar al menos un usuario`),B(`Debe seleccionar al menos un usuario`);return}try{if(i){let e=await xe(i,{userIds:a,title:t,description:n,status:r}),o=Y.findIndex(t=>t.id==e.id);o!==-1&&(Y[o]=e),J(Y),l(null),u.reset(),Je(),W(u.querySelector(`button[type="submit"]`),`Guardar Tarea`),z(`Tarea actualizada correctamente`)}else{let e=await ye({userIds:a,title:t,description:n,status:r});Y.push(e),J(Y),u.reset(),Je(),z(`Tarea registrada correctamente`)}}catch(e){B(e.message)}}),_.addEventListener(`click`,async e=>{let t=e.target.closest(`.btnUpdate`);if(!t)return;e.preventDefault();let n=t.getAttribute(`data-id`),r=t.closest(`.message-card`);if(!r)return;let i=W(r.querySelector(`.message-card__title`)).replace(`Tarea: `,``).trim(),a=W(r.querySelector(`.message-card__content`)).trim();d.value=i,p.value=a,h.value=``,l(n);try{Ye(await j.getByTaskId(n))}catch{}W(u.querySelector(`button[type="submit"]`),`Actualizar Tarea`),u.scrollIntoView({behavior:`smooth`,block:`center`}),d.focus()}),_.addEventListener(`click`,async e=>{let t=e.target.closest(`.btnDelete`);if(!t)return;e.preventDefault();let n=t.getAttribute(`data-id`);try{await Se(n),Y=Y.filter(e=>e.id!=n),J(Y),z(`Tarea eliminada correctamente`)}catch(e){B(e.message)}}),_.addEventListener(`click`,async e=>{let t=e.target.closest(`.btnComplete`);if(!t)return;e.preventDefault();let n=t.getAttribute(`data-id`);try{await be(n,{status:`completada`});let e=Y.find(e=>e.id==n);e&&(e.status=`completada`),J(Y),z(`Tarea marcada como completada`)}catch(e){B(e.message)}}),y.addEventListener(`input`,()=>J(Y)),b.addEventListener(`change`,()=>J(Y)),document.addEventListener(`change`,e=>{let t=e.target.closest(`#status-order`);if(!t)return;let n=t.value||`date`,r=ke();r.length&&Oe(r,n).forEach(e=>{_.appendChild(e.element)})}),ae.addEventListener(`click`,We),$();