import struct
import os

def get_png_dimensions(file_path):
    with open(file_path, 'rb') as f:
        data = f.read(24)
        if data[:8] != b'\x89PNG\r\n\x1a\n':
            return None
        w, h = struct.unpack('>II', data[16:24])
        return w, h

print(f"Pets: {get_png_dimensions('static/pets.png')}")
print(f"Food: {get_png_dimensions('static/food.png')}")
print(f"BG: {get_png_dimensions('static/bg.png')}")
