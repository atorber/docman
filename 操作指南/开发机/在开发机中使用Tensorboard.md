本文将介绍如何在百舸开发机中安装并使用Tensorboard工具。

## 环境准备
#### 端口配置
为了确保能够在公网环境访问Tensorboard服务，需要配置自定义端口，将服务暴露到公网：

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_fae5302.png)
#### Tensorboard安装
通过pip install来安装Tensorboard

```
pip install tensorboard
```
#### Tensorboard日志准备
首先需要确保Tensorboard日志已经存在于开发机目录中，若无可用日志，可通过如下脚本快速生成。该示例脚本通过随机数据生成包括标量、直方图、图像、文本、计算图、PR曲线和嵌入数据等多种数据类型的Tensorboard日志。

```
import torch
import torch.nn as nn
import numpy as np
from torch.utils.tensorboard import SummaryWriter
import datetime

# Set random seeds
torch.manual_seed(42)
np.random.seed(42)

# Create TensorBoard writer
log_dir = "logs/random_demo/" + datetime.datetime.now().strftime("%Y%m%d-%H%M%S")
writer = SummaryWriter(log_dir)

# 1. Scalar data - Simulating training metrics
for step in range(100):
    # Simulate loss decreasing
    loss = 2.0 * np.exp(-step / 20) + np.random.rand() * 0.2
    # Simulate accuracy increasing
    accuracy = 0.3 + 0.7 * (1 - np.exp(-step / 30)) + np.random.rand() * 0.05
    
    writer.add_scalar('Loss/train', loss, step)
    writer.add_scalar('Accuracy/train', accuracy, step)
    
    # Add more scalars
    writer.add_scalar('Learning_rate', 0.001 * np.exp(-step / 50), step)
    writer.add_scalar('Batch_time', 0.1 + np.random.rand() * 0.05, step)

# 2. Histogram data - Simulating weight distributions
for step in range(0, 100, 20):
    # Simulate neural network weights
    weights = torch.randn(1000) * (1.0 - step/100)
    biases = torch.randn(100) * 0.1
    gradients = torch.randn(500) * 0.01
    
    writer.add_histogram('weights/layer1', weights, step)
    writer.add_histogram('biases/layer1', biases, step)
    writer.add_histogram('gradients', gradients, step)

# 3. Image data - Random images
for step in range(0, 100, 25):
    # Generate random RGB images (3, 32, 32)
    random_images = torch.rand(8, 3, 32, 32)  # 8 images, 3 channels, 32x32
    writer.add_images('Random_images', random_images, step)
    
    # Generate random grayscale images
    gray_images = torch.rand(8, 1, 28, 28)
    writer.add_images('MNIST_like_images', gray_images, step)

# 4. Text data - Example text
sample_text = """
This is a TensorBoard demonstration log.
Generated using PyTorch with random data.
Includes various data types: scalars, histograms, images, text, etc.
"""
writer.add_text('Experiment_Info', sample_text, 0)
writer.add_text('Hyperparameters', 
                f"Batch size: 64\nLearning rate: 0.001\nOptimizer: Adam", 0)

# 5. Computation graph - Simple model structure
class SimpleModel(nn.Module):
    def __init__(self):
        super(SimpleModel, self).__init__()
        self.fc1 = nn.Linear(10, 20)
        self.fc2 = nn.Linear(20, 5)
    
    def forward(self, x):
        x = torch.relu(self.fc1(x))
        x = self.fc2(x)
        return x

model = SimpleModel()
dummy_input = torch.rand(1, 10)
writer.add_graph(model, dummy_input)

# 6. PR curve (Precision-Recall Curve)
num_samples = 1000
probabilities = torch.rand(num_samples)
labels = torch.randint(0, 2, (num_samples,)).float()
writer.add_pr_curve('Binary_Classification', labels, probabilities, 0)

# 7. Embedding data - High-dimensional data visualization
num_embeddings = 100
embedding_dim = 16
features = torch.randn(num_embeddings, embedding_dim)
metadata = [f'class_{i%5}' for i in range(num_embeddings)]

writer.add_embedding(features, metadata=metadata, 
                     tag='Random_embeddings', global_step=0)

# 8. Audio data - Random audio
try:
    sample_rate = 44100
    audio_data = torch.rand(1, sample_rate) * 2 - 1  # Normalize to [-1, 1]
    writer.add_audio('Random_audio', audio_data, 0, sample_rate=sample_rate)
    
    t = torch.linspace(0, 1, sample_rate)
    sine_wave = 0.3 * torch.sin(2 * np.pi * 440 * t)  # 440Hz A tone
    writer.add_audio('Sine_wave_440Hz', sine_wave.unsqueeze(0), 0, sample_rate=sample_rate)
except Exception as e:
    print(f"Audio generation skipped: {e}")

# 9. Scalar groups
for step in range(50):
    writer.add_scalars('Losses', {
        'train_loss': 1.0 / (step + 1),
        'val_loss': 1.5 / (step + 1),
        'test_loss': 2.0 / (step + 1)
    }, step)
    
    writer.add_scalars('Accuracies', {
        'train_acc': min(0.95, 0.5 + step * 0.01),
        'val_acc': min(0.92, 0.5 + step * 0.009),
        'test_acc': min(0.90, 0.5 + step * 0.008)
    }, step)

# 10. Custom scalar layout
layout = {
    'Training': {
        'Loss': ['Multiline', ['Loss/train', 'Loss/validation']],
        'Accuracy': ['Multiline', ['Accuracy/train', 'Accuracy/validation']]
    },
    'Distributions': {
        'Weights': ['Multiline', ['weights/layer1']]
    }
}
writer.add_custom_scalars(layout)

# Close the writer
writer.close()

print(f"TensorBoard logs generated to: {log_dir}")
```
## 启动Tensorboard
执行如下命令启动tensorboard服务，并指定端口和日志路径：
```
tensorboard --logdir={log_folder} --host=0.0.0.0 --port={tensorboard服务内部端口}
```
![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_16e2fa4.png)

然后浏览器访问 http://{开发机公网IP}:{BLB监听端口}/  即可打开：

![image.png](https://bce.bdstatic.com/doc/bce-doc/AIHC/image_daa1d0a.png)