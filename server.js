import express from 'express'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { networkInterfaces } from 'os'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_FILE = path.join(__dirname, 'data', 'menu.json')

const app = express()
app.use(express.json({ limit: '10mb' }))

// CORS (로컬 네트워크 접속 허용)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.sendStatus(200)
  next()
})

// GET /api/ping — 로컬 서버 헬스체크
app.get('/api/ping', (req, res) => {
  res.json({ ok: true })
})

// GET /api/data — 메뉴 데이터 읽기
app.get('/api/data', async (req, res) => {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8')
    res.json(JSON.parse(raw))
  } catch {
    res.status(404).json({ error: 'Data file not found' })
  }
})

// POST /api/data — 메뉴 데이터 저장
app.post('/api/data', async (req, res) => {
  try {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true })
    await fs.writeFile(DATA_FILE, JSON.stringify(req.body, null, 2), 'utf-8')
    res.json({ success: true })
  } catch (err) {
    console.error('데이터 저장 실패:', err)
    res.status(500).json({ error: 'Failed to save data' })
  }
})

// 정적 파일 서빙 (빌드된 React 앱)
app.use('/cambre', express.static(path.join(__dirname, 'dist')))
app.get('/cambre/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})
app.get('/', (req, res) => res.redirect('/cambre/'))

const PORT = process.env.PORT || 3001

app.listen(PORT, '0.0.0.0', () => {
  const nets = networkInterfaces()
  const localIPs = Object.values(nets)
    .flat()
    .filter((n) => n?.family === 'IPv4' && !n.internal)
    .map((n) => n?.address)

  console.log('\n🍸 CAMBRE 로컬 서버 시작!')
  console.log(`\n   PC     →  http://localhost:${PORT}/cambre/`)
  if (localIPs.length > 0) {
    console.log(`   모바일  →  http://${localIPs[0]}:${PORT}/cambre/`)
  }
  console.log(`\n   어드민  →  http://localhost:${PORT}/cambre/admin`)
  console.log(`   데이터  →  ./data/menu.json\n`)
})
