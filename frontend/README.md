# Anchor79 — Frontend

Base React + TypeScript + Vite para FE-001. Requiere Node.js 22.12+ y npm (ver también los requisitos de las dependencias bloqueadas en package-lock.json).

## Desarrollo

Ejecutar desde frontend/:

```sh
npm ci
npm run dev
npm run typecheck
npm run build
npm run lint
npm run preview
```

En PowerShell con scripts bloqueados, usar npm.cmd en lugar de npm. No es necesario cambiar la política de ejecución.

## Organización

- src/App.tsx: estructura de página y tema mediante estado React. Tema oscuro inicial; la selección no persiste al recargar.
- src/features/auth/pages/LoginPage.tsx: presentación del login y avisos para registro y recuperación futuros.
- src/features/auth/components/AuthBrandPanel.tsx: logo de código, presentación y beneficios de la plataforma.
- src/features/auth/components/LoginForm.tsx: campos controlados, validación local, visibilidad de contraseña y mensaje demostrativo.
- src/styles/tokens.css: paletas solicitadas y colores de uso con contraste AA.
- src/styles/global.css: composición responsive, controles, foco visible y reducción de movimiento.

No se creó una carpeta components/ui vacía: por ahora no existen componentes compartidos que justifiquen esa abstracción.

## Alcance

No hay autenticación, peticiones a la API, Firebase, almacenamiento de credenciales ni JWT. Un formulario válido muestra únicamente un aviso explícito de demostración pendiente de integración. Los enlaces de registro y recuperación muestran avisos accesibles; sus fragmentos identifican destinos futuros, sin implementar rutas o formularios.

Las credenciales existen solamente en el estado del formulario durante la sesión de la página. No se registran en consola ni se guardan en almacenamiento del navegador.

## Accesibilidad

Labels asociados, autocomplete, campos obligatorios, errores textuales con aria-describedby y aria-invalid, foco en el primer campo inválido y regiones alert/status. Los controles son accesibles por teclado y el selector de tema indica su estado mediante aria-pressed.

Se conservan los tokens base solicitados. Para texto secundario claro se utiliza --muted-text (#5B6A7E), ya que #64748B sobre #F5F7FA queda en 4,43:1. Se agregan --control-border y --error-text para contraste suficiente sin alterar la paleta base. Los colores semánticos success/warning quedan definidos, sin presentar estados ajenos al alcance.

## Verificación FE-001

TypeScript estricto, build y Oxlint. Además, se verificaron en Chrome headless mediante un script temporal sin dependencias adicionales: campos vacíos, correo inválido, formulario válido sin recarga, mostrar/ocultar contraseña, avisos de enlaces futuros, selector de tema, orden de tabulación y ausencia de scroll horizontal a 320, 768 y 1440 px en ambos temas. No se detectaron errores de consola ni solicitudes a la API en esos recorridos. Se inspeccionó una captura desktop.

Se midieron contrastes de texto, texto secundario, errores y botón (mínimo 4,5:1), y bordes/foco (mínimo 3:1) en ambas paletas. Estas verificaciones no sustituyen una auditoría completa con lectores de pantalla y dispositivos reales.

## Continuidad

En una tarea posterior: acordar el contrato de errores y sesión del JWT propio con backend, integrar POST /api/auth/login y agregar las pantallas y navegación de registro/recuperación. Ninguna de esas funciones forma parte de FE-001.

## FE-001B.1 — Layout de autenticación

Se tomó como referencia principal el segundo boceto aprobado. LoginPage compone el panel de marca y una tarjeta con título, subtítulo, formulario y enlaces. App conserva la configuración general y el estado del tema; la decoración circular se dibuja con CSS usando los tokens existentes y queda recortada en una capa independiente con aria-hidden y pointer-events: none.

- Desde 960 px: dos columnas, contenido limitado a 1120 px y tarjeta de hasta 440 px. La tarjeta no ocupa toda la columna.
- Por debajo de 960 px: una columna. Se mantiene el logo y se oculta el bloque comercial para priorizar el formulario sin comprimirlo. El orden del DOM se conserva.
- Hasta 480 px: padding lateral de 16 px y padding reducido en la tarjeta. No hay alturas fijas para el contenido; se permite scroll vertical natural.

LoginForm.tsx y tokens.css se conservaron sin modificaciones respecto de FE-001. No se agregaron dependencias.

Verificación: typecheck, build y lint correctos. Chrome headless comprobó ambos temas a 320, 368, 390, 768 y 1440 px, incluidos mensajes del formulario, ausencia de scroll horizontal, controles dentro del ancho visible y botón alcanzable mediante scroll vertical. Se verificaron el orden de tabulación, el cambio de tema, la validación, mostrar/ocultar contraseña, los enlaces futuros y el envío sin recarga. La decoración no intercepta los controles. No se detectaron errores de consola ni llamadas a la API. Se revisaron capturas de escritorio (1440 x 900) y móvil (390 x 844) en ambos temas, generadas temporalmente en node_modules/.tmp/fe-001b1-*.png.

Diferencias respecto del boceto: se conservan la paleta y los controles accesibles de FE-001, incluidos el botón textual Mostrar/Ocultar y el enlace de recuperación debajo del botón principal para no modificar el formulario. El círculo es CSS sin textura fotográfica y se conserva el pie de página. Las barras de ventana del boceto no forman parte de la interfaz. No se realizó una prueba con dispositivos físicos o lectores de pantalla.

## FE-001B.2 — Refinamiento visual

Se conserva el layout aprobado, las columnas, el máximo de tarjeta de 440 px y los breakpoints de 960 y 480 px. Sin medidas exactas en los bocetos, se eligieron: logo constante de 22 px con símbolo SVG de 36 x 32 px en todas las pantallas; título comercial de 30–36 px; título de login de 24–26 px; padding desktop de tarjeta de 30 x 28 px; inputs y botón de al menos 44 px para facilitar su uso. Se mantiene la tipografía del sistema, sin fuentes externas.

LoginForm cambia únicamente su presentación: contenedores con iconos SVG de correo/candado, botón de ojo con nombre accesible dinámico, flecha SVG y un espacio recoveryLink de tipo ReactNode antes del botón principal. LoginPage proporciona el mismo enlace y manejador de recuperación que ya existía; no se trasladan estados ni se modifica el comportamiento. Los estados, refs, validación, envío y manejadores de campos/enlaces se compararon con una copia previa y permanecen iguales.

Se refinaron el logo de código, la jerarquía tipográfica, los beneficios, fondos y bordes de la tarjeta, inputs, sombras y círculo CSS. Los tokens base se mantienen; se agregan action-start, action-end y action-text para el tratamiento azul con gradiente. En oscuro se usan #2879BB y #2167A4 con texto blanco (contraste mínimo 4,62:1); en claro se reutilizan primary y primary-hover. El botón incluye estilos hover, focus, active y disabled. No se agregó ninguna dependencia.

Typecheck, build y lint: correctos. El script funcional temporal de Chrome headless pasó nuevamente: campos vacíos, correo inválido, envío válido sin recarga, mensaje demostrativo, mostrar/ocultar contraseña, enlaces futuros, ambos temas y tabulación con foco visible. No se detectó scroll horizontal ni controles recortados a 320, 368, 390, 768 y 1440 px. La decoración no intercepta controles. No se detectaron errores de consola ni solicitudes a la API. Se midió el contraste de ambos extremos del gradiente del botón y de los tokens de texto, errores, bordes y foco.

Capturas revisadas visualmente frente a los dos bocetos: node_modules/.tmp/fe-001b2-{desktop,mobile}-{dark,light}.png. Son artefactos temporales ignorados por Git. También son temporales los scripts de verificación y las copias previas utilizadas para comparar lógica.

Las diferencias de FE-001B.1 sobre el ojo textual y la posición del enlace de recuperación quedan resueltas. Permanecen como diferencias: círculo CSS sin textura fotográfica, tipografía del sistema y pie de página existente. No se reproduce el marco de ventana del boceto ni sus otras pantallas, fuera del alcance. No se probaron lectores de pantalla ni dispositivos físicos.
