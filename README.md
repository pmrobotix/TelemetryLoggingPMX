# Installer le système d'exploitation

Télécharger Raspberry Pi Imager
https://www.raspberrypi.com/software/

Prendre Raspberry Pi OS Lite (64-bit)

Dans les options avancés, activez le SSH et définissez un mot de passe.

# Mettre à jours l'OS
sudo apt update
sudo apt dist-upgrade
sudo apt install git

# Installer NVM
cd /opt
sudo git clone https://github.com/nvm-sh/nvm.git
cd nvm
sudo git checkout v0.39.1

# Installer NodeJS
sudo su
. ./nvm.sh
nvm install node
exit

# Tester NodeJS
. ./nvm.sh
node
Ctrl+D

# Sourcer automatiquement le fichier nvm.sh
# Ajouter ces lignes à la fin du fichier ~/.bashrc et /root/.bashrc
# Note: Ceci ajoute un lag au login (evirons 1 seconde)
export NVM_DIR="/opt/nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

# Dossier du projet
sudo mkdir pmx
sudo chown pi:pi -R pmx
cd pmx

# Création du depôt git
git init
git remote add origin git@github.com:pmrobotix/TelemetryLoggingPMX.git

# Créer le frontend, application react
npx create-react-app frontend
cd frontend

# Démarrer le serveur en mode debug
npm start
Ctrl+C

# Lancer les tests
npm run test

# Pour avoir un build optimisé
npm build run
npm install -g serve
serve -s build --no-clipboard # Ne copie pas l'adresse dans le presse-papier

# Créer le backend, NodeJS pure
mkdir backend
cd backend
npm init # Project name backend, version 1.0.0, description "Backend of the PMX telemetry project", entry point "server.js", test "test_server.js"
npm install ws
# Créer le server.js
# Ajouter le .gitignore
