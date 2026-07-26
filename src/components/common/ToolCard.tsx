import Link from 'next/link';
import { ToolItem } from '@/types/tools';
import * as Icons from 'lucide-react';

interface ToolCardProps {
  tool: ToolItem;
}

export default function ToolCard({ tool }: ToolCardProps) {
  const IconComponent = (Icons as any)[tool.iconName] || Icons.Wrench;

  const isImage = tool.category === 'image';

  return (
    <Link
      href={`/${tool.slug}`}
      className="group relative p-6 rounded-3xl bg-white hover:bg-slate-50/50 border border-slate-200 hover:border-cyan-400 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden"
    >
      <div className="space-y-4 relative z-10">
        <div className="flex items-center justify-between">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-transform duration-300 group-hover:scale-110 ${
              isImage
                ? 'bg-cyan-50 text-cyan-600 border-cyan-200'
                : 'bg-purple-50 text-purple-600 border-purple-200'
            }`}
          >
            <IconComponent className="w-6 h-6" />
          </div>

          {tool.popular && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-100 text-cyan-700 border border-cyan-200">
              Popular
            </span>
          )}
          {tool.recentlyAdded && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-700 border border-purple-200">
              New
            </span>
          )}
        </div>

        <div>
          <h3 className="text-base font-bold text-slate-900 group-hover:text-cyan-600 transition-colors">
            {tool.title}
          </h3>
          <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">{tool.description}</p>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-200 mt-4 flex items-center justify-between text-xs font-semibold relative z-10">
        <span className={isImage ? 'text-cyan-600' : 'text-purple-600'}>
          {isImage ? 'Image Tool' : 'PDF Tool'}
        </span>
        <span className="text-slate-500 group-hover:text-slate-900 flex items-center gap-1 transition-colors">
          Open Tool →
        </span>
      </div>
    </Link>
  );
}
