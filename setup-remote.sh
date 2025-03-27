#!/bin/bash

# Reset the remote origin to GitHub and add Gitea
git remote remove origin
git remote add origin https://github.com/anshjindal/tdp-tender-discovery-platform
git remote set-url --add origin https://gitea.wouessi.com/Wouessi/tdp-tender-discovery-platform

echo "Remotes configured. Git will now push to GitHub first, then Gitea."
