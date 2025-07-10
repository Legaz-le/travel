import NewLocationClient from "@/components/new-location";

export default async function NewLocation({params}: {params: Promise<{ tripId: string }>}) {
  const { tripId } = params;
  return (
    <NewLocationClient tripId={tripId}/>
  );

}