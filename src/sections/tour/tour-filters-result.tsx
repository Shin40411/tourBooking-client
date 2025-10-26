import type { UseSetStateReturn } from 'minimal-shared/hooks';
import type { TourFilterParams } from 'src/types/tour';
import type { FiltersResultProps } from 'src/components/filters-result';

import { useCallback } from 'react';
import Chip from '@mui/material/Chip';
import { fDateRangeShortLabel } from 'src/utils/format-time';
import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

// ----------------------------------------------------------------------

type Props = FiltersResultProps & {
  filters: UseSetStateReturn<TourFilterParams>;
};

export function TourFiltersResult({ filters, totalResults, sx }: Props) {
  const { state: currentFilters, setState: updateFilters, resetState: resetFilters } = filters;

  const handleRemoveExtras = useCallback(
    (inputValue: string) => {
      const newValue = (currentFilters.extras ?? []).filter((item) => item !== inputValue);
      updateFilters({ extras: newValue });
    },
    [updateFilters, currentFilters.extras]
  );

  const handleRemoveIncludes = useCallback(
    (inputValue: string) => {
      const newValue = (currentFilters.includes ?? []).filter((item) => item !== inputValue);
      updateFilters({ includes: newValue });
    },
    [updateFilters, currentFilters.includes]
  );

  const handleRemoveDate = useCallback(() => {
    updateFilters({ fromDate: null, toDate: null });
  }, [updateFilters]);

  const handleRemoveLocation = useCallback(
    (inputValue: number) => {
      const newValue = (currentFilters.locationIds ?? []).filter((id) => id !== inputValue);
      updateFilters({ locationIds: newValue });
    },
    [updateFilters, currentFilters.locationIds]
  );

  return (
    <FiltersResult totalResults={totalResults} onReset={() => resetFilters()} sx={sx}>
      <FiltersBlock label="Thời gian:" isShow={Boolean(currentFilters.fromDate && currentFilters.toDate)}>
        <Chip
          {...chipProps}
          label={fDateRangeShortLabel(currentFilters.fromDate, currentFilters.toDate)}
          onDelete={handleRemoveDate}
        />
      </FiltersBlock>

      <FiltersBlock label="Bao gồm:" isShow={!!(currentFilters.includes ?? []).length}>
        {(currentFilters.includes ?? []).map((item) => (
          <Chip
            {...chipProps}
            key={item}
            label={item}
            onDelete={() => handleRemoveIncludes(item)}
          />
        ))}
      </FiltersBlock>

      <FiltersBlock label="Phụ thu:" isShow={!!(currentFilters.extras ?? []).length}>
        {(currentFilters.extras ?? []).map((item) => (
          <Chip
            {...chipProps}
            key={item}
            label={item}
            onDelete={() => handleRemoveExtras(item)}
          />
        ))}
      </FiltersBlock>

      <FiltersBlock label="Địa điểm:" isShow={!!(currentFilters.locationIds ?? []).length}>
        {(currentFilters.locationIds ?? []).map((item) => (
          <Chip
            {...chipProps}
            key={item}
            label={item}
            onDelete={() => handleRemoveLocation(item)}
          />
        ))}
      </FiltersBlock>
    </FiltersResult>
  );
}
