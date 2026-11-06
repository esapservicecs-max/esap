#!/bin/bash
# Car Manifest (Top Left)
convert public/assets/aistudio/image_6bfa2ae3.png -crop 380x215+120+75 +repage -fuzz 12% -transparent "#e7e4d8" -trim +repage public/assets/programs/carmanifest.png

# Export (Top Middle)
convert public/assets/aistudio/image_6bfa2ae3.png -crop 380x215+700+75 +repage -fuzz 12% -transparent "#e7e4d8" -trim +repage public/assets/programs/export.png

# Goods (Top Right)
convert public/assets/aistudio/image_6bfa2ae3.png -crop 380x215+1310+75 +repage -fuzz 12% -transparent "#e7e4d8" -trim +repage public/assets/programs/goods.png

# eTransit / Transshipment (Bottom Left)
convert public/assets/aistudio/image_6bfa2ae3.png -crop 380x215+90+680 +repage -fuzz 12% -transparent "#e7e4d8" -trim +repage public/assets/programs/etransit.png

# Import (Bottom Middle)
convert public/assets/aistudio/image_6bfa2ae3.png -crop 380x215+750+710 +repage -fuzz 12% -transparent "#e7e4d8" -trim +repage public/assets/programs/import.png

# Rgoods / FDA (Bottom Right)
convert public/assets/aistudio/image_6bfa2ae3.png -crop 380x215+1330+710 +repage -fuzz 12% -transparent "#e7e4d8" -trim +repage public/assets/programs/rgoods.png

ls -la public/assets/programs/
