const path = require('path');
const fs = require('fs');

class StaticCopyPlugin {
  apply(compiler) {
    compiler.hooks.afterEmit.tap('StaticCopyPlugin', (compilation) => {
      const fromDir = path.resolve(__dirname, 'public');
      const toDir = compiler.options.output.path;
      if (!fs.existsSync(fromDir)) return;
      for (const file of fs.readdirSync(fromDir)) {
        const src = path.join(fromDir, file);
        const dest = path.join(toDir, file);
        fs.copyFileSync(src, dest);
      }
    });
  }
}

module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: {
    background: './src/background/index.ts',
    content: './src/content_scripts/index.tsx'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    clean: true
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'builtin:swc-loader',
            options: {
              jsc: {
                parser: { syntax: 'typescript', tsx: true },
                transform: { react: { runtime: 'automatic' } }
              }
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      }
    ]
  },
  plugins: [new StaticCopyPlugin()],
  devtool: 'source-map'
};
