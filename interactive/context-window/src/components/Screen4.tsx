import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'motion/react';
import { AlertCircle, AlertOctagon } from 'lucide-react';

const generateData = () => {
  const data = [];
  for (let i = 0; i <= 20; i++) {
    let drift = Math.pow(i / 20, 2) * 85; 
    
    if (i > 5) {
      const noise = (Math.random() - 0.5) * (i * 2);
      drift = Math.max(0, Math.min(100, drift + noise));
    }
    
    data.push({
      turn: i,
      drift: Math.round(drift)
    });
  }
  return data;
};

const data = generateData();

export default function Screen4() {
  return (
    <div className="flex flex-col h-full items-center justify-center gap-4 sm:gap-6 md:gap-10 w-full">
      <div className="text-center max-w-3xl">
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight mb-2 md:mb-4 text-slate-900 dark:text-white">
          What this looks like when it goes wrong
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-400">
          As the transcript grows, the model has to juggle too much context. It starts forgetting earlier constraints, mixing up details, and confidently hallucinating.
        </p>
      </div>

      <div className="w-full max-w-5xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[1.5rem] md:rounded-[2rem] p-4 sm:p-6 md:p-12 shadow-xl relative mt-4">
        
        <div className="h-[250px] sm:h-[350px] md:h-[450px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
            >
              <defs>
                <linearGradient id="colorDrift" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" strokeOpacity={0.15} />
              <XAxis 
                dataKey="turn" 
                tick={{ fill: '#64748b', fontSize: 14 }}
                tickLine={false}
                axisLine={{ stroke: '#cbd5e1' }}
                label={{ value: 'Number of turns in conversation', position: 'insideBottom', offset: -15, fill: '#64748b', fontSize: 14, fontWeight: 500 }}
              />
              <YAxis 
                tick={{ fill: '#64748b', fontSize: 14 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}%`}
                label={{ value: 'Chance of Drift', angle: -90, position: 'insideLeft', fill: '#64748b', style: { textAnchor: 'middle' }, fontSize: 14, fontWeight: 500 }}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                formatter={(value: number) => [`${value}%`, 'Drift Risk']}
                labelFormatter={(label) => `Turn ${label}`}
              />
              <Area 
                type="monotone" 
                dataKey="drift" 
                stroke="#ef4444" 
                strokeWidth={4}
                fillOpacity={1} 
                fill="url(#colorDrift)" 
                animationDuration={2500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <motion.div 
          className="absolute top-1/4 left-[30%] max-w-[240px] bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm p-4 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-200 hidden md:flex items-start gap-3"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          viewport={{ once: true }}
        >
          <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <p className="font-medium leading-relaxed">Instructions from Turn 2 start getting deprioritized here.</p>
          <div className="absolute -bottom-2 right-1/2 w-4 h-4 bg-white dark:bg-slate-800 border-b border-r border-slate-200 dark:border-slate-700 transform rotate-45 translate-x-2"></div>
        </motion.div>

        <motion.div 
          className="absolute top-[15%] right-[10%] max-w-[260px] bg-red-50/95 dark:bg-red-900/90 backdrop-blur-sm p-4 rounded-2xl shadow-xl border border-red-200 dark:border-red-700/50 text-sm text-red-900 dark:text-red-100 hidden md:flex flex-col gap-2"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-red-600 dark:text-red-400" />
            <p className="font-bold text-base">Complete Context Loss</p>
          </div>
          <p className="opacity-90 leading-relaxed">The model is now confidently hallucinating non-existent facts and breaking layout rules.</p>
        </motion.div>
        
        <p className="absolute bottom-2 right-4 sm:bottom-6 sm:right-8 text-xs sm:text-sm text-slate-400 italic">
          *Chart is purely illustrative
        </p>
      </div>
    </div>
  );
}
