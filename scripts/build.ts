import { exec } from 'child_process';
import { existsSync } from 'fs';
import { rm, mkdir, readFile, writeFile } from 'fs/promises';
import { resolve } from 'path';

(async () => {
  // 清理旧文件 创建目标目录
  if (existsSync('dist')) {
    await rm('dist', { recursive: true });
  }
  await mkdir('dist', { recursive: true });

  // 读取manifest 并删除其中$schema字段 写入目标目录
  const manifestString = await readFile(resolve('src', 'manifest.json'), {
    encoding: 'utf-8',
    flag: 'r',
  });
  const manifest = JSON.parse(manifestString);
  delete manifest['$schema'];
  await writeFile(
    resolve('dist', 'manifest.json'),
    JSON.stringify(manifest, null, 2),
    {
      flag: 'w',
      encoding: 'utf-8',
    },
  );

  // 将ts编译为js写入目标目录
  exec('pwd', console.debug);
  exec('npx tsc --project tsconfig.prod.json');
})();
