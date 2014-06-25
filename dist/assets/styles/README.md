# The `assets/styles/` Directory

This folder contains "default" directory and bank-specific directories. Each of them contains style files (SASS/SCSS) to be compiled during the build. 

Only main.scss is referenced by the application. Any styles that are route-specific or component-specific should be imported into main.scss in this directory from files kept
alongside the JavaScript and HTML sources of that component.

By following such approach component's directories can be dragged and dropped into *any other project*
and it will "just work".
