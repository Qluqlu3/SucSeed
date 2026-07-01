export interface Creator {
  userId: string;
  name: string;
  title: string;
  avatarPath: string;
  createdAt: string;
}

const isNew = (createdAt: string): boolean => {
  const diffMs = Date.now() - new Date(createdAt).getTime();
  return diffMs <= 3 * 24 * 60 * 60 * 1000;
};

export const CreatorCard = ({ creator }: { creator: Creator }) => (
  <div className="w-1/4 mt-[1.5%] new-box hover:opacity-85">
    <a href={`/page/creator/${creator.userId}`} className="block hover:text-[#373737]!">
      <div className="overflow-hidden relative bg-[url('/assets/card-background.jpg')] transition duration-300 hover:shadow-[0_8px_16px_0_rgba(0,0,0,0.2)]">
        {isNew(creator.createdAt) && (
          <span className="inline-block absolute top-[-1%] right-0 m-0 pt-[2.3%] pb-[1.3%] px-0 z-2 w-[17%] text-center text-white text-[1.3vw] bg-p-gold rounded-[7px]">
            NEW
          </span>
        )}
        <div className="text-center">
          <img
            src={creator.avatarPath}
            className="rounded-full h-[30vh] w-[30vw] max-w-[37vw] min-w-[20vw]"
            width={300}
            height={300}
            alt={creator.name}
            loading="lazy"
          />
        </div>
        <div className="p-4">
          <h4 className="text-center py-0.75 text-[43px] font-bold">{creator.name}</h4>
          <p className="text-center py-0.75 text-[33px] font-bold">{creator.title}</p>
        </div>
      </div>
    </a>
  </div>
);
