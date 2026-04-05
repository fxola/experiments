import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { container } from '../../di/container';
import { Alarm } from '../../domain/alarm';
import { CreateAlarmParams, UpdateAlarmParams } from '../../domain/alarm';

const ALARMS_QUERY_KEY = ['alarms'];

export function useAlarms() {
  const queryClient = useQueryClient();

  const alarmsQuery = useQuery({
    queryKey: ALARMS_QUERY_KEY,
    queryFn: () => container.alarmUseCases.getAllAlarms(),
  });

  const createMutation = useMutation({
    mutationFn: (params: CreateAlarmParams) =>
      container.alarmUseCases.createAlarm(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ALARMS_QUERY_KEY });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, params }: { id: string; params: UpdateAlarmParams }) =>
      container.alarmUseCases.updateAlarm(id, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ALARMS_QUERY_KEY });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => container.alarmUseCases.deleteAlarm(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ALARMS_QUERY_KEY });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: (id: string) => container.alarmUseCases.toggleAlarm(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ALARMS_QUERY_KEY });
    },
  });

  return {
    alarms: alarmsQuery.data ?? [],
    isLoading: alarmsQuery.isLoading,
    error: alarmsQuery.error,
    refetch: alarmsQuery.refetch,
    createAlarm: createMutation.mutate,
    updateAlarm: updateMutation.mutate,
    deleteAlarm: deleteMutation.mutate,
    toggleAlarm: toggleMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isToggling: toggleMutation.isPending,
  };
}
