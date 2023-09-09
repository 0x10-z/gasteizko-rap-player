// CustomToast.tsx
import { toast } from "react-toastify";

// Objeto para llevar un registro de los mensajes y sus contadores
const messageRegistry: {
  [key: string]: { count: number; toastId?: string | number };
} = {};

interface ErrorOptions {
  trace?: string;
}

function showToast(
  message: string,
  content: React.ReactNode,
  toastFunction: (msg: React.ReactNode) => string | number
) {
  if (message) {
    // Si el mensaje ya se ha mostrado
    if (messageRegistry[message]) {
      const count = messageRegistry[message].count + 1;
      messageRegistry[message].count = count;

      // Actualizar el mensaje existente con el contador
      toast.update(messageRegistry[message].toastId!, {
        render: () => (
          <>
            {content}
            {` (x${count})`}
          </>
        ),
        // ... otras opciones que desees
      });
    } else {
      // Mostrar el mensaje como una nueva notificación usando la función de toast proporcionada
      const toastId = toastFunction(content);

      // Registrar el mensaje y su ID
      messageRegistry[message] = { count: 1, toastId };
    }
  }
}

export const customToast = {
  success: (message: string) => showToast(message, message, toast.success),
  error: (message: string, options?: ErrorOptions) => {
    const content = options?.trace ? (
      <>
        {message}
        <br />
        <small>{options.trace}</small>
      </>
    ) : (
      message
    );
    showToast(message, content, toast.error);
  },
  warning: (message: string) => showToast(message, message, toast.warn),
  default: (message: string) => showToast(message, message, toast),
};
