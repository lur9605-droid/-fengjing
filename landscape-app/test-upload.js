// 测试上传功能
const fs = require('fs');
const path = require('path');

// 读取测试SVG文件
const svgContent = fs.readFileSync('test-image.svg', 'utf8');

// 将SVG转换为base64
const base64Image = 'data:image/svg+xml;base64,' + Buffer.from(svgContent).toString('base64');

console.log('测试图片base64长度:', base64Image.length);
console.log('测试图片base64前缀:', base64Image.substring(0, 50) + '...');

// 创建测试照片数据
const testPhoto = {
  id: 'test-' + Date.now(),
  title: '测试风景照片',
  description: '这是一张用于测试的风景照片，包含绿色圆形和简单路径。',
  location: '测试地点',
  imageUrl: base64Image,
  userId: 'test-user-001',
  userName: '测试用户',
  userAvatar: '',
  uploadTime: new Date().toISOString(),
  likes: 5,
  comments: [
    {
      id: 'comment-1',
      userId: 'user-1',
      userName: '用户1',
      userAvatar: '',
      content: '美丽的测试照片！',
      timestamp: new Date().toISOString()
    }
  ],
  tags: ['测试', '风景', 'SVG']
};

console.log('\n测试照片数据:');
console.log('ID:', testPhoto.id);
console.log('标题:', testPhoto.title);
console.log('图片URL长度:', testPhoto.imageUrl.length);
console.log('评论数量:', testPhoto.comments.length);

// 验证base64格式
const isValidBase64 = testPhoto.imageUrl.startsWith('data:image/svg+xml;base64,');
console.log('Base64格式验证:', isValidBase64 ? '有效' : '无效');

console.log('\n✅ 测试照片数据创建完成！');
console.log('现在你可以手动将此数据添加到localStorage中进行测试。');