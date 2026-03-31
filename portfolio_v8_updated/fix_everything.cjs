const fs = require('fs');

const homePath = 'src/components/Home.tsx';
let homeData = fs.readFileSync(homePath, 'utf8');
homeData = homeData.replace(/img: 'https:\/\/images\.unsplash\.com\/photo-1447069387593[^']*'/, "img: '/palestine_peace.png'");
homeData = homeData.replace(/img: 'https:\/\/images\.unsplash\.com\/photo-1529156069898[^']*'/, "img: '/communication_barriers.png'");
homeData = homeData.replace(/img: 'https:\/\/images\.unsplash\.com\/photo-1541873676[^']*'/, "img: '/plato_mawardi.png'");
fs.writeFileSync(homePath, homeData);

const resPath = 'src/components/Research.tsx';
let resData = fs.readFileSync(resPath, 'utf8');
resData = resData.replace(/img: 'https:\/\/images\.unsplash\.com\/photo-1529156069898[^']*'/, "img: '/communication_barriers.png'");
resData = resData.replace(/img: 'https:\/\/images\.unsplash\.com\/photo-1565943983735[^']*'/, "img: '/ukraine_politics.png'");
resData = resData.replace(/img: 'https:\/\/images\.unsplash\.com\/photo-1541873676[^']*'/, "img: '/plato_mawardi.png'");
resData = resData.replace(/img: 'https:\/\/images\.unsplash\.com\/photo-1585829365295[^']*'/, "img: '/social_media_opinion.png'");
resData = resData.replace(/img: 'https:\/\/images\.unsplash\.com\/photo-1447069387593[^']*'/, "img: '/palestine_peace.png'");
resData = resData.replace(/img: 'https:\/\/images\.unsplash\.com\/photo-1451187580459[^']*'/, "img: '/qualityland_robots.png'");
resData = resData.replace(/img: 'https:\/\/images\.unsplash\.com\/photo-1523240795612[^']*'/, "img: '/excellence_illusion.png'");

// Modal animation substitution
const modalSearch = `{/* ── Modal ── */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            className={\`bg-white dark:bg-background-dark rounded-2xl w-full overflow-hidden shadow-2xl flex flex-col \${
              selected.iframeUrl ? 'max-w-5xl h-[90vh]' : 'max-w-2xl max-h-[88vh]'
            }\`}`;

const modalReplace = `{/* ── Modal ── */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className={\`bg-white dark:bg-background-dark rounded-2xl w-full overflow-hidden shadow-2xl flex flex-col \${
                selected.iframeUrl ? 'max-w-5xl h-[90vh]' : 'max-w-2xl max-h-[88vh]'
              }\`}`;

resData = resData.replace(modalSearch, modalReplace);

const modalEndSearch = `            )}
          </div>
        </div>
      )}`;

const modalEndReplace = `            )}
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>`;

resData = resData.replace(modalEndSearch, modalEndReplace);

fs.writeFileSync(resPath, resData);
console.log('Successfully completed image replacing and modal animations');
