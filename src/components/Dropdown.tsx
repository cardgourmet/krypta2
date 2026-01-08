import { IconCheck, IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import { useEffect, useRef, useState } from 'react';
import { useWindowSize } from '../hooks/useWindowSize.ts';
import styles from './Dropdown.module.css';

interface DropdownProps {
  buttonText?: string;
  items: Record<string, string>;
  defaultSelected?: string;
  onSelect?: (selected: string) => void;
}

export default function Dropdown(props: DropdownProps) {
  const [open, setOpen] = useState(false);

  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const shouldOpenRight = (ref: HTMLDivElement | null, windowWidth: number): boolean => {
    if (!ref) return false;

    const isVisible = ref.getBoundingClientRect().right <= windowWidth;
    return !isVisible;
  };

  const [selected, setSelected] = useState<string | null>(props.defaultSelected || null);

  const toggle = () => {
    const newOpen = !open;

    setOpen(newOpen);
    buttonRef.current?.setAttribute('active', newOpen + '');
    contentRef.current?.setAttribute('active', newOpen + '');

    const right = shouldOpenRight(contentRef.current, window.innerWidth);
    if (newOpen && right) {
      contentRef.current?.setAttribute('right', 'true');
    } else {
      contentRef.current?.setAttribute('right', 'false');
    }
  };

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (open && !dropdownRef.current?.contains(event.target as Element)) {
        toggle();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  });

  const [width] = useWindowSize();
  const [previousWidth, setPreviousWidth] = useState(0);

  // TODO: debounce, but idgaf
  // biome-ignore lint/correctness/useExhaustiveDependencies: idgaf
  useEffect(() => {
    const newWidth = width;
    const isAlreadyRight = contentRef.current?.getAttribute('right') === 'true';

    setPreviousWidth(newWidth);

    if (newWidth < previousWidth && isAlreadyRight) {
      return;
    }
    if (newWidth > previousWidth && !isAlreadyRight) {
      return;
    }

    const right = shouldOpenRight(contentRef.current, width);
    if (right) {
      contentRef.current?.setAttribute('right', 'true');
    } else {
      contentRef.current?.setAttribute('right', 'false');
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width]);

  return (
    <div className={styles.dropdown} ref={dropdownRef}>
      <button type="button" ref={buttonRef} className={styles.dropdownButton} onClick={() => toggle()}>
        <div>
          <p>{selected ? props.items[selected] : '?'}</p>

          {open && <IconChevronUp size={15} />}
          {!open && <IconChevronDown size={15} />}
        </div>
      </button>
      <div className={styles.dropdownContent} ref={contentRef}>
        {Object.entries(props.items).map(([key, label]) => (
          // biome-ignore lint/a11y/useKeyWithClickEvents: idgaf
          // biome-ignore lint/a11y/noStaticElementInteractions: idgaf
          <div
            key={key}
            onClick={() => {
              setSelected(key);
              props.onSelect?.(key);

              toggle();
            }}
          >
            <p style={selected === key ? { color: 'white' } : {}}>{label}</p>
            {selected === key && <IconCheck color={'white'} size={18} />}
          </div>
        ))}
      </div>
    </div>
  );
}
