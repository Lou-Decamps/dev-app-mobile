/**
 * @fileoverview Task sorting and filtering bar.
 */
import { TaskStatus } from "../constants/taskStatus";

/**
 * Control bar displaying sorting options (date, name)
 * and filters (status, folder, current/all).
 * Each button is a toggle—one click activates, a second click deactivates.
 *
 * @param {Object} props
 * @param {string} props.sortBy - Active sorting option
 * @param {Function} props.onSortChange - Callback to change the sort order
 * @param {string[]} props.selectedStatuses - Active filtered statuses
 * @param {Function} props.onToggleStatus - Callback to enable/disable a status
 * @param {number[]} props.selectedFolderIds - IDs of filtered folders
 * @param {Function} props.onToggleFolderFilter - Callback to enable/disable a folder
 * @param {Object[]} props.folders - List of available folders
 * @param {string} props.activeFilter - Active global filter (FILTERS.ACTIVE or ALL)
 * @param {Function} props.onActiveFilterChange - Callback to change the filter global
 * @param {Object} props.FILTERS - Filter constants
 * @param {Object} props.SORT_OPTIONS - Sort option constants
 */
export default function SortFilterBar({
                                          sortBy,
                                          onSortChange,
                                          selectedStatuses,
                                          onToggleStatus,
                                          selectedFolderIds,
                                          onToggleFolderFilter,
                                          folders,
                                          activeFilter,
                                          onActiveFilterChange,
                                          FILTERS,
                                          SORT_OPTIONS,
                                      }) {
    return (
        <div className="sort-filter-bar">

            <div className="sort-filter-bar__section">
                <span className="sort-filter-bar__label">Trier par</span>
                <div className="sort-filter-bar__options">
                    <button
                        type="button"
                        className={`sort-filter-bar__btn ${sortBy === SORT_OPTIONS.DUE_DATE ? "sort-filter-bar__btn--active" : ""}`}
                        onClick={() => onSortChange(SORT_OPTIONS.DUE_DATE)}
                    >
                        Date échéance
                    </button>
                    <button
                        type="button"
                        className={`sort-filter-bar__btn ${sortBy === SORT_OPTIONS.CREATION_DATE ? "sort-filter-bar__btn--active" : ""}`}
                        onClick={() => onSortChange(SORT_OPTIONS.CREATION_DATE)}
                    >
                        Date création
                    </button>
                    <button
                        type="button"
                        className={`sort-filter-bar__btn ${sortBy === SORT_OPTIONS.NAME ? "sort-filter-bar__btn--active" : ""}`}
                        onClick={() => onSortChange(SORT_OPTIONS.NAME)}
                    >
                        Nom
                    </button>
                </div>
            </div>

            <div className="sort-filter-bar__section">
                <span className="sort-filter-bar__label">Statut</span>
                <div className="sort-filter-bar__options">

                    <button
                        type="button"
                        className={`sort-filter-bar__btn ${
                            activeFilter === FILTERS.ACTIVE && selectedStatuses.length === 0
                                ? "sort-filter-bar__btn--active"
                                : ""
                        }`}
                        onClick={() => {
                            onToggleStatus("__clear__");
                            onActiveFilterChange(FILTERS.ACTIVE);
                        }}
                    >
                        En cours
                    </button>

                    <button
                        type="button"
                        className={`sort-filter-bar__btn ${
                            activeFilter === FILTERS.ALL && selectedStatuses.length === 0
                                ? "sort-filter-bar__btn--active"
                                : ""
                        }`}
                        onClick={() => {
                            onToggleStatus("__clear__");
                            onActiveFilterChange(FILTERS.ALL);
                        }}
                    >
                        Tout
                    </button>

                    {Object.values(TaskStatus).map((status) => (
                        <button
                            key={status}
                            type="button"
                            className={`sort-filter-bar__btn ${
                                selectedStatuses.includes(status)
                                    ? "sort-filter-bar__btn--active"
                                    : ""
                            }`}
                            onClick={() => onToggleStatus(status)}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {folders.length > 0 && (
                <div className="sort-filter-bar__section">
                    <span className="sort-filter-bar__label">Dossiers</span>
                    <div className="sort-filter-bar__options">
                        {folders.map((f) => (
                            <button
                                key={f.id}
                                type="button"
                                className={`sort-filter-bar__btn ${
                                    selectedFolderIds.includes(f.id)
                                        ? "sort-filter-bar__btn--active sort-filter-bar__btn--folder-active"
                                        : ""
                                }`}
                                style={
                                    selectedFolderIds.includes(f.id)
                                        ? { borderColor: `var(--folder-color-${f.color})`,
                                            backgroundColor: `var(--folder-color-${f.color})` }
                                        : { borderColor: `var(--folder-color-${f.color})` }
                                }
                                onClick={() => onToggleFolderFilter(f.id)}
                            >
                                {f.title}
                            </button>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
}