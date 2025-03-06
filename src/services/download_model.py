from ultralytics import YOLO

# Download and load the YOLOv8 Nano model (pre-trained on COCO dataset)
model = YOLO("yolov8n.pt")

# Verify the model is loaded
print("✅ YOLOv8-Nano model downloaded and loaded successfully!")
