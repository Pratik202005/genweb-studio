import { useVoting } from '../hooks/useVoting';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReact, faHtml5, faCss3Alt, faSquareJs  } from "@fortawesome/free-brands-svg-icons";
import Swal from 'sweetalert2';

const handleRedirect = (projectType, id, title, description) => {
  if (id && !String(id).startsWith('dummy-')) {
    const isReact = projectType === true || projectType === "react";
    if (isReact) {
        window.location.href = '/main/react/' + id;
    } else {
        window.location.href = '/main/plain/' + id;
    }
  } else {
    Swal.fire({
      icon: 'info',
      title: `<span class="text-white font-bold">${title || 'Showcase Project'}</span>`,
      html: `
        <div class="text-left text-zinc-300 text-sm space-y-3 pt-2">
          <p>${description || 'Curated community project template synthesized with GenWeb Studio.'}</p>
          <div class="p-3 bg-zinc-800/80 rounded-xl text-xs text-zinc-300 flex items-center justify-between">
            <span>Framework:</span>
            <strong class="text-indigo-400 font-semibold uppercase">${projectType === 'react' || projectType === true ? 'React.js' : 'HTML / CSS / JS'}</strong>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Generate Website',
      cancelButtonText: 'Close',
      confirmButtonColor: '#6366F1',
      cancelButtonColor: '#27272A',
      background: '#121214',
      color: '#F4F4F5',
      customClass: {
        popup: 'border border-zinc-800 rounded-2xl shadow-2xl',
      }
    }).then((res) => {
      if (res.isConfirmed) {
        window.location.href = '/';
      }
    });
  }
};

export const TemplateCard = ({ id, title, description, initialVotes, projectType, user }) => {
    const { votes, loading, handleVote } = useVoting(id, initialVotes, user);
    let type = projectType;
    return (
      <div className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/80 hover:border-zinc-700/80 rounded-2xl p-6 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40 transition-all duration-300 ease-out flex flex-col justify-between cursor-pointer group">
        <div className="flex items-center justify-between mb-3" onClick={()=>{handleRedirect(projectType, id, title, description)}}>
          <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">{title}</h3>
        </div>

        <div className="text-zinc-400 text-sm leading-relaxed mb-5 h-24 overflow-hidden text-ellipsis line-clamp-4"
        onClick={()=>{handleRedirect(projectType, id, title, description)}}
        >{description}</div>
        
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <button 
              onClick={() => handleVote('up')}
              disabled={loading}
              className="group flex items-center gap-2 px-3 py-2 rounded-lg 
                hover:bg-slate-800 transition-colors disabled:opacity-50"
              aria-label="Upvote"
            >
              <svg 
                className={`w-6 h-6 transition-all 
                  ${votes.upvotes.includes(user?._id) 
                    ? 'fill-green-500 stroke-green-500' 
                    : 'fill-transparent stroke-slate-400 group-hover:stroke-green-400'}`}
                viewBox="0 0 24 24" 
                strokeWidth="2"
              >
                <path d="M12 3L3 18h18L12 3z" />  
              </svg>
              <span className={`text-sm font-medium
                ${votes.upvotes.includes(user?._id) 
                  ? 'text-green-500' 
                  : 'text-slate-400 group-hover:text-slate-300'}`}>
                {votes.upvotes.length}
              </span>
            </button>
            <button 
              onClick={() => handleVote('down')}
              disabled={loading}
              className="group flex items-center gap-2 px-3 py-2 rounded-lg 
                hover:bg-slate-800 transition-colors disabled:opacity-50"
              aria-label="Downvote"
            >
              <svg 
                className={`w-6 h-6 transition-all rotate-180 
                  ${votes.downvotes.includes(user?._id) 
                    ? 'fill-red-500 stroke-red-500' 
                    : 'fill-transparent stroke-slate-400 group-hover:stroke-red-400'}`}
                viewBox="0 0 24 24" 
                strokeWidth="2"
              >
                <path d="M12 3L3 18h18L12 3z" />  
              </svg>
              <span className={`text-sm font-medium
                ${votes.downvotes.includes(user?._id) 
                  ? 'text-red-500' 
                  : 'text-slate-400 group-hover:text-slate-300'}`}>
                {votes.downvotes.length}
              </span>
            </button>
          </div>
          <div className="rounded-lg">
          {type? (<FontAwesomeIcon icon={faReact} className='h-8 w-8' />):(
            <div>
            <FontAwesomeIcon icon={faHtml5} className='h-7 w-7' />
            <FontAwesomeIcon icon={faCss3Alt} className='h-7 w-7' />
            <FontAwesomeIcon icon={faSquareJs} className='h-7 w-7' />
            </div>
          )}
          </div>
        </div>
        </div>
    );
};