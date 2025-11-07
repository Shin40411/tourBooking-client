type LocationOption = { id: string | number; name: string };
type GenerateTourCodeParams = {
    locations: LocationOption[];
    date: string | number | null;
};

export function generateTourCode({ locations, date }: GenerateTourCodeParams) {
    if (!date || locations.length === 0) return "";

    const d = new Date(date);
    const dateStr = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;

    const formatLocation = (name: string) =>
        name
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/\s+/g, "")
            .toUpperCase();

    const locationPart = locations.map((loc) => formatLocation(loc.name)).join("-");

    return `${dateStr}-${locationPart}`;
}
