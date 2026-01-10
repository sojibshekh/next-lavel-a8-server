
set 0 errexit
set 0 nounset

npm install
npm run build
npx prisma generate
npx prisma migrate deploy
