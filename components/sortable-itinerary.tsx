import { Location } from "@/app/generated/prisma";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { useId, useState } from "react";
import { CSS } from "@dnd-kit/utilities";
import { reorderItinerary } from "@/lib/actions/reorder-itinerary";

interface SortableItineraryProps {
  locations: Location[];
  tripId: string;
}

function SortableItem({ item }: { item: Location }) {
    const {attributes, listeners, setNodeRef, transform, transition} = useSortable({id: item.id});
  return (
    <div ref={setNodeRef} {...attributes} {...listeners}
    style={{transform: CSS.Transform.toString(transform), transition}}
    className="p-4 border rounded-md flex justify-between items-center hover:shadow transition-shadow">
      <div>
        <h4 className="font-medium text-gray-800">{item.locationTitle}</h4>
        <p className="text-sm text-gray-500 truncate max-w-xs">{`Latitude: ${item.lat}, Longitude: ${item.lng}`}</p>
      </div>
      <div className="text-sm text-gray-600">
        Day {item.order}
      </div>
    </div>
  );
}

export default function SortableItinerary({
  locations,
  tripId,
}: SortableItineraryProps) {
  const id = useId();
  const [localLocations, setLocalLocations] = useState(locations);
  const handleDragEnd = async (event: DragEndEvent) => {
    const {active, over} = event;
    if (active.id !== over?.id){
        const oldIndex = localLocations.findIndex((loc) => loc.id === active.id);
        const newIndex = localLocations.findIndex((loc) => loc.id === over!.id);

        const newLocations = arrayMove(localLocations, oldIndex, newIndex).map((item, index) => (
            {...item, order: index + 1}
        ));

        setLocalLocations(newLocations);

        await reorderItinerary(tripId, newLocations.map((item) => item.id))
    }
  };
  return (
    <DndContext
      id={id}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        strategy={verticalListSortingStrategy}
        items={localLocations.map((loc) => loc.id)}
      >
        <div className="space-y-4">
          {localLocations.map((item, key) => (
            <SortableItem key={key} item={item} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
