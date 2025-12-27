# MatchPro – Plataforma de Matching entre Candidatos y Vacantes Impulsada por IA

## Project Description
> MatchPro es una plataforma impulsada por IA que optimiza el proceso de reclutamiento, conectando a empleadores con los candidatos más compatibles de manera rápida, precisa y transparente.

> Las empresas suelen perder tiempo filtrando postulantes no calificados, mientras que muchos candidatos no saben cómo destacar. MatchPro elimina esa fricción utilizando análisis avanzado con IA y un ecosistema basado en datos.

---

### 📂 Repository Structure
- TODO
---

### Responsabilidades de MatchPro:

- Publicación estructurada de vacantes: Los empleadores crean ofertas laborales o de freelance mediante un formulario guiado y estandarizado que garantiza descripciones claras y comparables.

- Análisis de perfiles con IA: La plataforma analiza el perfil ideal para cada puesto y lo compara automáticamente con toda la base de candidatos disponibles.

- Ranking de compatibilidad con explicación: MatchPro genera un listado de los candidatos más compatibles, acompañado de explicaciones que detallan por qué cada coincidencia es adecuada.

- Cuentas inteligentes para candidatos: Los candidatos pueden crear perfiles optimizados con IA, que analiza su currículum y extrae habilidades, experiencia y fortalezas clave para maximizar su potencial de coincidencia.

MatchPro optimiza los procesos de contratación y empodera a los candidatos, creando un ecosistema transparente y basado en datos que mejora la calidad de los matches para ambos lados.

---

### 🗒️ Requimientos:
1. n8n
2. Applicacion de Dropbox (con Refresh token, CLient ID, Client Token)
3. MySQL
4. Node.js
5. API de Google Gemini

---

## 🤖 Instrucción de n8n:
1. Importe un workflow de "Iniciar esto/MatchPro-Workflow.json" a n8n
2. Configure un credencial de Dropbox (Método recomendado: OAuth2 manual con Refresh Token)

   a. Cree una app en Dropbox
   
   b. Ir a: https://www.dropbox.com/developers/apps

   c. Cree una app → tipo Scoped Access

   d. Tipo: App folder

   e. Escriba http://localhost:5678/rest/oauth2-credential/callback para Redirect URIs 

   f. Active scopes:
     - files.content.read
     - files.content.write
     - files.metadata.read
        
   g. Obtenga App Key (CLIENT_ID) y App Secret (CLIENT_SECRET)
    
   h. Video para obtener el Refresh Token de Dropbox: https://www.youtube.com/watch?v=y0tBLoSfjxc

   i. En Dropbox HTTP Request1, escriba unos valores:
     - refresh_token: Refresh Token
     - client_id: App Key
     - client_secret: App Secret
  
4. Configue un credencial del nodo "Google Gemini Chat Model"

   - Host: https://generativelanguage.googleapis.com
   - API Key: 
     - La clave de su proyecto en Google AI Studio: https://aistudio.google.com/app/apikey

---

## Instrucción de MySQL:
1. Importe los datos del archivo SQL de `Iniciar esto/MatchPro-Datos.sql` a MySQL.

   Pasos recomendados (Windows / PowerShell):

   - Crear la base de datos y usuario (opcional si el SQL ya incluye estas sentencias):

     ```sql
     CREATE DATABASE IF NOT EXISTS `matchprodb` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
     CREATE USER IF NOT EXISTS 'matchpro'@'localhost' IDENTIFIED BY 'CAMBIE_A_UNA_CONTRASEÑA_SEGURA';
     GRANT ALL PRIVILEGES ON `matchprodb`.* TO 'matchpro'@'localhost';
     FLUSH PRIVILEGES;
     ```

   - Importar el archivo SQL (ejemplo desde PowerShell):

     ```powershell
     mysql -u root -p matchprodb < "C:\Users\hacki\Documents\MatchPro\Iniciar esto\MatchPro-Datos.sql"
     ```

   - Alternativa usando `source` dentro del cliente `mysql`:

     ```powershell
     mysql -u root -p
     USE matchprodb;
     SOURCE C:/Users/hacki/Documents/MatchPro/Iniciar esto/MatchPro-Datos.sql;
     ```

2. Configurar variables de entorno del proyecto

   - Ajuste el archivo `.env.local` con los valores correctos (ya existe un ejemplo en el proyecto):

     - `DB_HOST=localhost`
     - `DB_USER=matchpro`  (o `root` si prefiere)
     - `DB_PASSWORD=su_contraseña`
     - `DB_NAME=matchprodb`
     - `DB_PORT=3306`

   - El archivo `src/server/lib/dt.ts` usa `mysql2/promise` y lee estas variables para crear el pool de conexiones.

3. Verificar la importación y la conexión

   - Comprobar tablas con el cliente MySQL:

     ```powershell
     mysql -u matchpro -p -e "SHOW TABLES IN matchprodb;"
     ```

   - Probar la conexión desde Node (ejemplo rápido):

     ```js
     // run a small Node script or reutilice la app: intenta una query simple
     const mysql = require('mysql2/promise');
     const pool = mysql.createPool({host:'localhost', user:'matchpro', password:'su_contraseña', database:'matchprodb'});
     const [rows] = await pool.query('SELECT 1 + 1 AS solution');
     console.log(rows);
     ```

4. Solución de problemas comunes

   - Error de autenticación `ER_NOT_SUPPORTED_AUTH_MODE`: ejecutar (MySQL 8+)

     ```sql
     ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'su_contraseña';
     FLUSH PRIVILEGES;
     ```

   - Error `Too many connections`: aumentar `connectionLimit` en `.env.local` o en `src/server/lib/dt.ts`.

   - Asegúrese de que el servicio MySQL está en ejecución y que el firewall permite conexiones en el puerto `3306` si accede remotamente.

5. Notas finales

   - Mantenga las contraseñas fuera del control de versiones; use `.env.local` y no lo suba al repo.
   - Si el archivo SQL contiene `CREATE DATABASE` y `USE`, no es necesario recrear la base de datos manualmente.
   - Una vez importado, inicie la aplicación y verifique que las rutas API que dependen de la base de datos funcionan correctamente.
---
## Progreso de MatchPro

### General

| Plan | Estatus |
|---|---|
| Workflow de análisis de CV | ✅ Listo |
| Conexion desde MySQL a la plataforma | ✅ Listo |
| Subir CV en PDF desde la plataforma a n8n | ✅ Listo |
| Editar la información basica del usuario | ⏳ TODO |
| Iniciar sesión con un correo y una contraseña | ✅ Listo |

### Candidato

| Plan | Estatus |
|---|---|
| Dashboard del candidato (`CandidateDashboard.tsx`) | ✅ Listo |
| Editar perfil / formulario de perfil (`CandidateProfileForm.tsx`) | ✅ Listo |
| Completar información del candidato / onboarding (`FillCandidateInfo.tsx`) | ✅ Listo |
| Formulario de postulación a vacantes (`JobApplicationForm.tsx`) | ✅ Listo |
| Búsqueda de vacantes (`JobSearch.tsx`) | ✅ Listo |
| Visualización de detalles de una vacante (`JobDetails.tsx`) | ✅ Listo |


### Reclutador
| Plan | Estatus |
|---|---|
| Dashboard del reclutador (`RecruiterDashboard.tsx`) | ✅ Listo |
| Publicar nueva vacante (`PostJob.tsx`) | ✅ Listo |
| Gestionar vacantes (`ManageJobs.tsx`, `EditJob.tsx`) | ✅ Listo |
| Ver aplicaciones a vacantes (`JobApplications.tsx`) | ✅ Listo |
| Base de datos de candidatos (`CandidatesDatabase.tsx`) | ✅ Listo |
| Agregar candidato manualmente (`AddCandidate.tsx`) | ✅ Listo |
| Editar candidato (`EditCandidate.tsx`) | ✅ Listo |
| Perfil del empleador / formulario (`EmployerProfileForm.tsx`) | ⏳ TODO |
| Búsqueda en LinkedIn (`LinkedInSearch.tsx`) | ✅ Listo |
| Gestión de clientes (`ClientsManagement.tsx`) | ✅ Listo |
| Referir candidato / flujos de referencia (`ReferCandidateWizard.tsx`, `ReferredCandidates.tsx`) | ✅ Listo |
| Reportes y analítica (`ReportsAnalytics.tsx`) | ✅ Listo |

_Notas: los estatus se infirieron por la presencia de componentes en `src/components/Pages/Recruiter` y `src/components/Pages/Candidate`. La presencia de un componente indica que la UI correspondiente existe; su funcionalidad completa (integración backend, validaciones, etc.) puede requerir verificación adicional._
