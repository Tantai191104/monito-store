import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Root, Thumb, Track } from '@radix-ui/react-slider';
// ✅ Import Color constructor và Color type từ thư viện
import Color from 'color';
import { PipetteIcon } from 'lucide-react';
import {
  type ChangeEventHandler,
  type ComponentProps,
  type HTMLAttributes,
  useCallback,
  useEffect,
  useRef,
  useState,
  createContext,
  useContext,
} from 'react';

type ColorType = ReturnType<typeof Color>;

// ✅ Use ColorType instead of Color for the interface
interface ColorPickerContextValue {
  color: ColorType;
  setColor: (color: ColorType) => void;
  mode: string;
  setMode: (mode: string) => void;
}

const ColorPickerContext = createContext<ColorPickerContextValue | undefined>(
  undefined,
);

export const useColorPicker = () => {
  const context = useContext(ColorPickerContext);
  if (!context) {
    throw new Error('useColorPicker must be used within a ColorPickerProvider');
  }
  return context;
};

export type ColorPickerProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange'
> & {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
};

export const ColorPicker = ({
  value,
  defaultValue = '#000000',
  onChange,
  className,
  children,
  ...props
}: ColorPickerProps) => {
  // ✅ Force alpha to 1 for solid colors only
  const [color, setColor] = useState<ColorType>(() =>
    Color(value || defaultValue).alpha(1),
  );
  const [mode, setMode] = useState('hex');

  // ✅ Update internal state when controlled value changes
  useEffect(() => {
    if (value && value !== color.hex()) {
      try {
        // ✅ Always set alpha to 1 for solid colors
        setColor(Color(value).alpha(1));
      } catch (error) {
        console.warn('Invalid color value:', value);
      }
    }
  }, [value, color]);

  // ✅ Handle color changes and notify parent with solid color
  const handleColorChange = useCallback(
    (newColor: ColorType) => {
      // ✅ Force alpha to 1 before setting
      const solidColor = newColor.alpha(1);
      setColor(solidColor);
      if (onChange) {
        onChange(solidColor.hex());
      }
    },
    [onChange],
  );

  return (
    <ColorPickerContext.Provider
      value={{
        color,
        setColor: handleColorChange,
        mode,
        setMode,
      }}
    >
      <div className={cn('grid w-full gap-4', className)} {...props}>
        {children}
      </div>
    </ColorPickerContext.Provider>
  );
};

export type ColorPickerSelectionProps = HTMLAttributes<HTMLDivElement>;

export const ColorPickerSelection = ({
  className,
  ...props
}: ColorPickerSelectionProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { color, setColor } = useColorPicker();

  // ✅ Get current HSV values for positioning
  const hsv = color.hsv().object();
  const { h: hue, s: saturation, v: value } = hsv;

  const handlePointerMove = useCallback(
    (event: PointerEvent) => {
      if (!isDragging || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(
        0,
        Math.min(1, (event.clientX - rect.left) / rect.width),
      );
      const y = Math.max(
        0,
        Math.min(1, (event.clientY - rect.top) / rect.height),
      );

      // ✅ Update color using HSV for better color picker behavior
      const newColor = Color.hsv(hue, x * 100, (1 - y) * 100);
      setColor(newColor);
    },
    [isDragging, hue, setColor],
  );

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', () => setIsDragging(false));
    }
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', () => setIsDragging(false));
    };
  }, [isDragging, handlePointerMove]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative aspect-video w-full cursor-crosshair rounded',
        className,
      )}
      style={{ backgroundColor: `hsl(${hue}, 100%, 50%)` }}
      onPointerDown={(e) => {
        e.preventDefault();
        setIsDragging(true);
        handlePointerMove(e.nativeEvent);
      }}
      {...props}
    >
      {/* Gradients for saturation and brightness */}
      <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />

      {/* Selector dot */}
      <div
        className="pointer-events-none absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white"
        style={{
          left: `${saturation}%`,
          top: `${100 - value}%`,
          boxShadow: '0 0 0 1px rgba(0,0,0,0.5)',
        }}
      />
    </div>
  );
};

export type ColorPickerHueProps = HTMLAttributes<HTMLDivElement>;

export const ColorPickerHue = ({
  className,
  ...props
}: ColorPickerHueProps) => {
  const { color, setColor } = useColorPicker();
  const hue = color.hue();

  return (
    <Root
      value={[hue]}
      max={360}
      step={1}
      className={cn('relative flex h-4 w-full touch-none', className)}
      onValueChange={([h]) => setColor(color.hue(h))}
      {...props}
    >
      <Track className="relative my-0.5 h-3 w-full grow rounded-full bg-[linear-gradient(90deg,#FF0000,#FFFF00,#00FF00,#00FFFF,#0000FF,#FF00FF,#FF0000)]" />
      <Thumb className="border-primary/50 bg-background focus-visible:ring-ring block h-4 w-4 rounded-full border shadow-transition-colors focus-visible:ring-1 focus-visible:outline-none" />
    </Root>
  );
};

export type ColorPickerAlphaProps = HTMLAttributes<HTMLDivElement>;

export const ColorPickerAlpha = ({
  className,
  ...props
}: ColorPickerAlphaProps) => {
  const { color, setColor } = useColorPicker();
  const alpha = color.alpha() * 100;

  return (
    <Root
      value={[alpha]}
      max={100}
      step={1}
      className={cn('relative flex h-4 w-full touch-none', className)}
      onValueChange={([a]) => setColor(color.alpha(a / 100))}
      {...props}
    >
      <Track className='relative my-0.5 h-3 w-full grow rounded-full bg-[url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3uCTZhw1gGGYhAGBZIA/nYDCgBDAm9BGDWAAJyRCgLaBCAAgXwixzAS0pgAAAABJRU5ErkJggg==")]'>
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `linear-gradient(to right, transparent, ${color.hex()})`,
          }}
        />
      </Track>
      <Thumb className="border-primary/50 bg-background focus-visible:ring-ring block h-4 w-4 rounded-full border shadow-transition-colors focus-visible:ring-1 focus-visible:outline-none" />
    </Root>
  );
};

export type ColorPickerEyeDropperProps = ComponentProps<typeof Button>;

export const ColorPickerEyeDropper = ({
  className,
  ...props
}: ColorPickerEyeDropperProps) => {
  const { setColor } = useColorPicker();

  const handleEyeDropper = async () => {
    try {
      // @ts-ignore - EyeDropper API is experimental
      const eyeDropper = new EyeDropper();
      const result = await eyeDropper.open();
      setColor(Color(result.sRGBHex));
    } catch (error) {
      console.error('EyeDropper failed:', error);
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleEyeDropper}
      className={cn('text-muted-foreground shrink-0', className)}
      {...props}
    >
      <PipetteIcon size={16} />
    </Button>
  );
};

export type ColorPickerOutputProps = ComponentProps<typeof SelectTrigger>;

const formats = ['hex', 'rgb', 'hsl'];

export const ColorPickerOutput = ({
  className,
  ...props
}: ColorPickerOutputProps) => {
  const { mode, setMode } = useColorPicker();
  return (
    <Select value={mode} onValueChange={setMode}>
      <SelectTrigger className="h-8 w-[4.5rem] shrink-0 text-xs" {...props}>
        <SelectValue placeholder="Mode" />
      </SelectTrigger>
      <SelectContent>
        {formats.map((format) => (
          <SelectItem key={format} value={format} className="text-xs">
            {format.toUpperCase()}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

type PercentageInputProps = ComponentProps<typeof Input>;

const PercentageInput = ({ className, ...props }: PercentageInputProps) => (
  <div className="relative">
    <Input
      type="text"
      {...props}
      className={cn(
        'bg-secondary h-8 w-[3.25rem] rounded-l-none px-2 text-xs shadow-none',
        className,
      )}
    />
    <span className="text-muted-foreground absolute top-1/2 right-2 -translate-y-1/2 text-xs">
      %
    </span>
  </div>
);

export type ColorPickerFormatProps = HTMLAttributes<HTMLDivElement>;

export const ColorPickerFormat = ({
  className,
  ...props
}: ColorPickerFormatProps) => {
  const { color, setColor, mode } = useColorPicker();

  if (mode === 'hex') {
    const hex = color.hex();
    const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
      try {
        const newValue = `#${event.target.value}`;
        // ✅ Force alpha to 1
        setColor(Color(newValue).alpha(1));
      } catch (error) {
        // Invalid color, ignore
      }
    };
    return (
      <div
        className={cn(
          'relative flex items-center -space-x-px shadow-sm',
          className,
        )}
        {...props}
      >
        <span className="absolute top-1/2 left-2 -translate-y-1/2 text-xs">
          #
        </span>
        <Input
          value={hex.substring(1)}
          onChange={handleChange}
          className="bg-secondary h-8 pl-4 text-xs shadow-none"
        />
      </div>
    );
  }

  if (mode === 'rgb') {
    const rgb = color.rgb().round().array();
    return (
      <div
        className={cn('flex items-center -space-x-px shadow-sm', className)}
        {...props}
      >
        {/* ✅ Only show R, G, B values (no alpha) */}
        {rgb.slice(0, 3).map((value, index) => (
          <Input
            key={index}
            type="text"
            value={value}
            readOnly
            className={cn(
              'bg-secondary h-8 rounded-none px-2 text-xs shadow-none',
              !index && 'rounded-l-md',
              index === 2 && 'rounded-r-md' // Last item
            )}
          />
        ))}
      </div>
    );
  }

  if (mode === 'hsl') {
    const hsl = color.hsl().round().array();
    return (
      <div
        className={cn('flex items-center -space-x-px shadow-sm', className)}
        {...props}
      >
        {/* ✅ Only show H, S, L values (no alpha) */}
        {hsl.slice(0, 3).map((value, index) => (
          <Input
            key={index}
            type="text"
            value={value}
            readOnly
            className={cn(
              'bg-secondary h-8 rounded-none px-2 text-xs shadow-none',
              !index && 'rounded-l-md',
              index === 2 && 'rounded-r-md' // Last item
            )}
          />
        ))}
      </div>
    );
  }

  return null;
};
