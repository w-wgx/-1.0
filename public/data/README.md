# 地球资源文件说明

## ✅ 已迁移
- `countries.geo.json` (256KB) - 国家边界 GeoJSON 数据

## ⚠️ 缺失资源（需要手动获取）

地球纹理需要以下两个文件，可从 ECharts 官方示例下载：

| 文件名 | 大小 | 来源 |
|--------|------|------|
| `earth-blue-marble.jpg` | ~750KB | ECharts 官方示例 |
| `earth-topology.png` | ~200KB | ECharts 官方示例 |

### 下载方法

**方法 1：从 ECharts 官方 CDN 下载**
```bash
# 蓝海纹理
curl -o public/data/earth-blue-marble.jpg https://echarts.apache.org/examples/data-gl/asset/earth-blue-marble.jpg

# 地形纹理
curl -o public/data/earth-topology.png https://echarts.apache.org/examples/data-gl/asset/earth-topology.png
```

**方法 2：使用本地已有贴图替换**

将任意地球 JPG/PNG 图片放入此目录，并在 `GlobeViewer.vue` 中修改：
```typescript
baseTexture: '/data/your-earth-texture.jpg',
heightTexture: '/data/your-topology.png', // 可选
```

## 🛡️ 防御性处理

`GlobeViewer.vue` 已做防御性处理：
- 如果纹理加载失败，会回退到 `displacementScale: 0` 的纯色地球
- 不会因贴图缺失而崩溃
- 仍能展示国家散点、边界高亮、旋转交互

## 📊 当前可用效果

- ✅ 3D 地球基础渲染（纯色球体）
- ✅ 国家散点（按国家数量大小映射）
- ✅ 国家边界高亮 + 呼吸动画
- ✅ 点击国家 → 显示面板
- ✅ 飞向选中国家
- ✅ 自动旋转 / 缩放 / 拖拽

## 📌 待补全

- 装备数据接入（按 equipment 表结构）
- 国家选中后的分类饼图、年代柱状图
- 装备列表与详情
