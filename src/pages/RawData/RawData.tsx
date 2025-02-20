import { createEffect, createMemo } from 'solid-js';
import createDBsStore from './createDBsStore';
import Table, {
  TableHeader,
  TableHeaderCol,
  TableHeaderColAction,
  TableBody,
} from '../../components/Table';
import * as constants from '../../utils/constants';
import RawDataRow from './RawDataRow';
import { useMainContext } from '../../hooks/MainContext';
export default () => {
  const {
    storesResource,
    tagsResource,
    recipesResource,
    craftingTablesResource,
  } = useMainContext();
  const { downloadFile } = createDBsStore();

  const storesExportedAt = createMemo(
    () => storesResource?.()?.ExportedAt?.StringRepresentation ?? 'Not exported'
  );
  const recipesExportedAt = createMemo(
    () =>
      recipesResource?.()?.ExportedAt?.StringRepresentation ?? 'Not exported'
  );
  const tagsExportedAt = createMemo(
    () => tagsResource?.()?.ExportedAt?.StringRepresentation ?? 'Not exported'
  );
  const craftingTablesExportedAt = createMemo(
    () =>
      craftingTablesResource?.()?.ExportedAt?.StringRepresentation ??
      'Not exported'
  );
  return (
    <Table>
      <TableHeader>
        <TableHeaderCol>File name</TableHeaderCol>
        <TableHeaderCol>Last update</TableHeaderCol>
        <TableHeaderColAction>Download</TableHeaderColAction>
      </TableHeader>
      <TableBody>
        {storesResource?.()?.ExportedAt && (
          <RawDataRow
            name="Stores"
            exportedAt={storesExportedAt}
            downloadFile={() => downloadFile(constants.Stores)}
          />
        )}
        {recipesResource?.()?.ExportedAt && (
          <RawDataRow
            name="Recipes"
            exportedAt={recipesExportedAt}
            downloadFile={() => downloadFile(constants.Recipes)}
          />
        )}
        {tagsResource?.()?.ExportedAt && (
          <RawDataRow
            name="Tags"
            exportedAt={tagsExportedAt}
            downloadFile={() => downloadFile(constants.Tags)}
          />
        )}
        {craftingTablesResource?.()?.ExportedAt && (
          <RawDataRow
            name="Crafting Tables"
            exportedAt={craftingTablesExportedAt}
            downloadFile={() => downloadFile(constants.CraftingTables)}
          />
        )}
      </TableBody>
    </Table>
  );
};
