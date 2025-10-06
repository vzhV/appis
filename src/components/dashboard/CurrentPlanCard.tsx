interface CurrentPlanCardProps {
  className?: string;
}

export default function CurrentPlanCard({ className = '' }: CurrentPlanCardProps) {
  return (
    <div className={`bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-xl p-6 text-white relative overflow-hidden ${className}`}>
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="text-sm opacity-80 mb-1">CURRENT PLAN</div>
            <h2 className="text-3xl font-bold">Developer</h2>
          </div>
          <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Manage Plan
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm">API Usage</span>
            <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <div className="text-sm opacity-80">Monthly plan</div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>0/1,000 Credits</span>
              <span>0%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div className="bg-white rounded-full h-2 w-0 transition-all duration-300"></div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm">Pay as you go</span>
              <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="bg-white/20 rounded-full p-1 w-12 h-6 flex items-center">
              <div className="bg-white rounded-full w-4 h-4 shadow-sm"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
    </div>
  );
}
