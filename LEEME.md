# Cuentas claras: cómo publicarlo

## 1. Subir a Netlify (gratis)
1. Creá una cuenta en netlify.com y subí esta carpeta a un repositorio de GitHub.
2. En Netlify: Add new site > Import an existing project > elegí el repo. No hace falta cambiar nada (netlify.toml ya tiene la configuración).
3. Cuando termine el deploy tenés una URL tipo tu-sitio.netlify.app. Los grupos compartidos funcionan solos (se guardan en Netlify Blobs).

Para probarlo en tu PC antes: `npm install` y luego `npx netlify dev`.

## 2. Dominio propio
- Comprá el dominio (nic.ar para .com.ar, o Namecheap/Cloudflare para .com).
- En Netlify: Domain management > Add a domain, y seguí los pasos para apuntar el DNS.

## 3. Cómo funciona
- Sin link de grupo: los datos quedan solo en el navegador de cada persona.
- "Compartir con el grupo" crea un link con un código único. Quien lo tenga puede ver y cargar gastos, y la pantalla se actualiza sola cada 5 segundos.
- Límites: 30 personas y 500 gastos por grupo.
