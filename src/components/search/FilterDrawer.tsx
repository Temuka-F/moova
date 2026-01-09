import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface FilterDrawerProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    priceRange: [number, number]
    setPriceRange: (range: [number, number]) => void
    currentCount: number
    transmission: 'AUTOMATIC' | 'MANUAL' | null
    setTransmission: (v: 'AUTOMATIC' | 'MANUAL' | null) => void
    minSeats: number
    setMinSeats: (v: number) => void
    instantBookOnly: boolean
    setInstantBookOnly: (v: boolean) => void
    activeFeatures: string[]
    setActiveFeatures: (v: string[]) => void
    // New Props
    selectedCategory: string | null
    setSelectedCategory: (v: string | null) => void
    selectedMake: string | null
    setSelectedMake: (v: string | null) => void
    selectedModel: string | null
    setSelectedModel: (v: string | null) => void
    selectedFuelType: string | null
    setSelectedFuelType: (v: string | null) => void
    availableMakes: string[]
    availableModels: string[]
}

const FEATURES_LIST = [
    { id: '4WD/AWD', label: 'All Wheel Drive' },
    { id: 'Bluetooth', label: 'Bluetooth' },
    { id: 'Apple CarPlay', label: 'Apple CarPlay' },
    { id: 'Snow Tires', label: 'Winter Tires' },
    { id: 'Roof Rack', label: 'Roof Rack' },
]

export function FilterDrawer({
    open,
    onOpenChange,
    priceRange,
    setPriceRange,
    currentCount,
    transmission,
    setTransmission,
    minSeats,
    setMinSeats,
    instantBookOnly,
    setInstantBookOnly,
    activeFeatures,
    setActiveFeatures,
    selectedCategory,
    setSelectedCategory,
    selectedMake,
    setSelectedMake,
    selectedModel,
    setSelectedModel,
    selectedFuelType,
    setSelectedFuelType,
    availableMakes,
    availableModels
}: FilterDrawerProps) {

    const toggleFeature = (featureId: string) => {
        if (activeFeatures.includes(featureId)) {
            setActiveFeatures(activeFeatures.filter(f => f !== featureId))
        } else {
            setActiveFeatures([...activeFeatures, featureId])
        }
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="bottom" className="h-auto max-h-[85vh] rounded-t-3xl md:max-w-md md:mx-auto md:rounded-2xl md:bottom-auto md:top-1/2 md:-translate-y-1/2 p-6 overflow-y-auto">
                <SheetHeader className="mb-6 space-y-1">
                    <SheetTitle className="text-lg font-bold">Filters</SheetTitle>
                    <SheetDescription className="text-xs">
                        Refine your search results
                    </SheetDescription>
                </SheetHeader>

                <div className="space-y-8 pb-20 md:pb-0">
                    {/* Make & Model */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase text-gray-500 tracking-wider">Make</label>
                            <Select value={selectedMake || "all"} onValueChange={(val) => {
                                setSelectedMake(val === "all" ? null : val)
                                setSelectedModel(null) // Reset model when make changes
                            }}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Any Make" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Any Make</SelectItem>
                                    {availableMakes.map(make => (
                                        <SelectItem key={make} value={make}>{make}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase text-gray-500 tracking-wider">Model</label>
                            <Select
                                value={selectedModel || "all"}
                                onValueChange={(val) => setSelectedModel(val === "all" ? null : val)}
                                disabled={!selectedMake}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Any Model" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Any Model</SelectItem>
                                    {availableModels.map(model => (
                                        <SelectItem key={model} value={model}>{model}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="h-px bg-gray-100" />

                    {/* Category */}
                    <div className="space-y-3">
                        <label className="text-xs font-semibold uppercase text-gray-500 tracking-wider">Category</label>
                        <div className="grid grid-cols-3 gap-2">
                            {[null, 'suv', 'sedan', 'compact', 'luxury', 'sports'].map((cat) => (
                                <button
                                    key={String(cat)}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={cn(
                                        "py-2 px-1 rounded-lg text-[11px] font-medium border transition-all truncate",
                                        selectedCategory === cat
                                            ? "bg-black text-white border-black"
                                            : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                                    )}
                                >
                                    {cat ? cat.charAt(0).toUpperCase() + cat.slice(1) : 'Any'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="h-px bg-gray-100" />

                    {/* Fuel Type */}
                    <div className="space-y-3">
                        <label className="text-xs font-semibold uppercase text-gray-500 tracking-wider">Fuel Type</label>
                        <div className="grid grid-cols-2 gap-2">
                            {[null, 'PETROL', 'DIESEL', 'HYBRID', 'ELECTRIC'].map((fuel) => (
                                <button
                                    key={String(fuel)}
                                    onClick={() => setSelectedFuelType(fuel)}
                                    className={cn(
                                        "py-2 px-3 rounded-lg text-xs font-medium border transition-all",
                                        selectedFuelType === fuel
                                            ? "bg-black text-white border-black"
                                            : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                                    )}
                                >
                                    {fuel ? fuel.charAt(0).toUpperCase() + fuel.slice(1).toLowerCase() : 'Any Fuel'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="h-px bg-gray-100" />

                    {/* Price Range */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-semibold uppercase text-gray-500 tracking-wider">Daily Price</label>
                            <span className="text-sm font-bold bg-gray-100 px-2 py-1 rounded-md">
                                ₾{priceRange[0]} - ₾{priceRange[1]}
                            </span>
                        </div>
                        <Slider
                            defaultValue={[priceRange[0], priceRange[1]]}
                            max={300}
                            min={30}
                            step={5}
                            value={[priceRange[0], priceRange[1]]}
                            onValueChange={(val) => setPriceRange([val[0], val[1]])}
                            className="py-2"
                        />
                        <div className="flex justify-between text-[10px] text-gray-400 font-medium">
                            <span>₾30</span>
                            <span>₾300+</span>
                        </div>
                    </div>

                    <div className="h-px bg-gray-100" />

                    {/* Instant Book */}
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <label className="text-sm font-medium text-gray-900">Instant Book</label>
                            <p className="text-[10px] text-gray-500">Book without waiting for owner approval</p>
                        </div>
                        <Switch
                            checked={instantBookOnly}
                            onCheckedChange={setInstantBookOnly}
                        />
                    </div>

                    <div className="h-px bg-gray-100" />

                    {/* Transmission */}
                    <div className="space-y-3">
                        <label className="text-xs font-semibold uppercase text-gray-500 tracking-wider">Transmission</label>
                        <div className="flex gap-2">
                            {[null, 'AUTOMATIC', 'MANUAL'].map((type) => (
                                <button
                                    key={String(type)}
                                    onClick={() => setTransmission(type as any)}
                                    className={cn(
                                        "flex-1 py-2 px-3 rounded-lg text-sm font-medium border transition-all",
                                        transmission === type
                                            ? "bg-black text-white border-black"
                                            : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                                    )}
                                >
                                    {type === null ? 'Any' : type === 'AUTOMATIC' ? 'Automatic' : 'Manual'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="h-px bg-gray-100" />

                    {/* Seats */}
                    <div className="space-y-3">
                        <label className="text-xs font-semibold uppercase text-gray-500 tracking-wider">Minimum Seats</label>
                        <div className="flex gap-2">
                            {[2, 4, 5, 7].map((num) => (
                                <button
                                    key={num}
                                    onClick={() => setMinSeats(num)}
                                    className={cn(
                                        "flex-1 py-2 rounded-lg text-sm font-medium border transition-all",
                                        minSeats === num
                                            ? "bg-black text-white border-black"
                                            : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                                    )}
                                >
                                    {num}+
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="h-px bg-gray-100" />

                    {/* Features */}
                    <div className="space-y-3">
                        <label className="text-xs font-semibold uppercase text-gray-500 tracking-wider">Features</label>
                        <div className="grid grid-cols-1 gap-3">
                            {FEATURES_LIST.map((feature) => (
                                <div key={feature.id} className="flex items-center space-x-3">
                                    <Checkbox
                                        id={feature.id}
                                        checked={activeFeatures.includes(feature.id)}
                                        onCheckedChange={() => toggleFeature(feature.id)}
                                    />
                                    <label
                                        htmlFor={feature.id}
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        {feature.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-4 border-t border-gray-100 bg-white">
                    <Button className="w-full rounded-lg h-11 text-sm font-semibold" onClick={() => onOpenChange(false)}>
                        Show {currentCount} cars
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    )
}
