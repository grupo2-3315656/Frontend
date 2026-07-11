import { userInfoDisplay } from "../services/config.js";

// ============================================
// MOSTRAR INFORMACIÓN DEL USUARIO
// ============================================

export const showUserInfo = (user) => {
    userInfoDisplay.innerHTML = `
    
        <div class="message-card__header">
        
            <div class="message-card__user">
            
                <div class="message-card__avatar">
                    ${user.name.charAt(0)}
                </div>

                <div>
                    <div class="message-card__username">
                        ${user.name}
                    </div>

                    <div class="message-card__title">
                        Usuario encontrado
                    </div>
                </div>

            </div>

        </div>

        <div class="message-card__content">

            <strong>Documento:</strong> ${user.id}<br>
            <strong>Nombre:</strong> ${user.name}<br>
            <strong>Email:</strong> ${user.email}

        </div>
    `;
};
