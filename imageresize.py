import PIL
from PIL import Image

img = Image.open('D:\Abdul Moiz\scholarship app\Affidavit2.jpeg')
img = img.resize((700, 1000), PIL.Image.Resampling.LANCZOS)
img.save('Compressed1.jpg')