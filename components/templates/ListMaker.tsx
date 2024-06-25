import { EditorContext } from '@/store/EditorContext';
import { FileContentContext, LtFileContent } from '@/store/FileContentContext';
import { use, useContext, useState } from 'react';
import Preview from '../ui/Preview';

const ListMaker = ({ content }: {content: LtFileContent}) => {
  const [list, setList] = useState(content?.items || []);
  const { selectedItem } = useContext(EditorContext);
  const [newItem, setNewItem] = useState<string>("");
  const { updateFileContent } = useContext(FileContentContext);
  const fileName = selectedItem?.name || "";

  const addItem = () => {
    const newList = [...list, { id: list.length + 1 + "", content: newItem }];
    setList(newList);
    setNewItem('');
    updateFileContent(fileName, { items: newList });

  }

  return (
    <>
      <div className='p-6 w-full flex flex-col items-center'>
          <div className='max-w-[80%] w-full'>
              <div className='flex gap-5'>
                  <input
                      className="p-3 rounded bg-primary-light text-primary focus:outline-none focus:ring-2 w-full "
                      value={newItem}
                      onChange={(e) => setNewItem(e.target.value)}
                      placeholder="Add New item"
                  />
                  <button onClick={addItem} className="p-2 px-5 bg-blue-500 text-white rounded">Add</button>

              </div>
              <List list={list} />
          </div>
      
      </div>
    
    </>

  );
};

const List = ({list}: {list: {id: string, content: string}[]}) => {
  return (
      <ul className='mt-6 w-full gap-4 h-full'>
          {list.map((item, index) => (
              <li key={index} className="p-2 bg-primary text-black rounded-[6px] mt-4">{item.content}</li>
          ))}
     </ul>
  );
}

export default ListMaker;
