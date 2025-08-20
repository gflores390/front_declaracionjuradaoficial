# Usa una imagen base de Node.js ligera para reducir el tamaño final de la imagen.
FROM node:23-slim

# Establece el directorio de trabajo dentro del contenedor.
# Todas las rutas subsiguientes estarán relativas a este directorio.
WORKDIR /app

# --- Instalación de dependencias del sistema ---
# Actualiza los paquetes e instala `procps` (para comandos como `ps`, `top`) y `tzdata` (para la configuración de zona horaria).
# `procps` puede ser útil para depuración dentro del contenedor.
# `rm -rf /var/lib/apt/lists/*` limpia el cache de APT para mantener la imagen pequeña.
RUN apt-get update && apt-get install -y \
    procps \
    tzdata \
    && rm -rf /var/lib/apt/lists/*

# --- Configuración de zona horaria ---
# Crea un enlace simbólico para establecer la zona horaria del sistema.
# Luego, escribe la zona horaria en /etc/timezone, que es lo que usan muchos programas.
# Establecer la variable de entorno TZ asegura que las aplicaciones dentro del contenedor también usen esta zona horaria.
RUN ln -snf /usr/share/zoneinfo/America/La_Paz /etc/localtime && echo "America/La_Paz" > /etc/timezone
ENV TZ=America/La_Paz

# --- Instalación de dependencias de Node.js ---
# Copia solo los archivos package.json y package-lock.json (o yarn.lock) primero.
# Esto permite que Docker cachee la capa de instalación de dependencias.
# Si solo cambian los archivos de código fuente y no las dependencias, Docker usará el cache.
COPY package*.json ./

# Instala todas las dependencias del proyecto.
RUN npm install

# --- Copia del código fuente ---
# Copia el resto del código de la aplicación al directorio de trabajo en el contenedor.
# Esto debe hacerse DESPUÉS de instalar las dependencias para aprovechar el cache de la capa anterior.
COPY . .

# --- Configuración de la aplicación ---
# Expone el puerto 3000, que es donde Next.js normalmente se ejecuta en modo de desarrollo.
EXPOSE 3000

# Define el comando por defecto para ejecutar la aplicación cuando el contenedor se inicie.
# En modo de desarrollo, `npm run dev` es el comando común para Next.js.
CMD ["npm", "run", "dev"]
