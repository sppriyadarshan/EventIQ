import React, { useState, useMemo } from 'react';
import PageContainer from '../../components/ui/PageContainer';
import SectionHeading from '../../components/ui/SectionHeading';
import Card, { CardTitle, CardDescription } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Modal from '../../components/ui/Modal';
import IconButton from '../../components/ui/IconButton';
import EmptyState from '../../components/ui/EmptyState';
import { useEventIQ } from '../../context/EventIQContext';
import {
  Boxes,
  Plus,
  Search,
  SlidersHorizontal,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Users,
  Building,
  Truck,
  Utensils,
  DollarSign,
  Package,
} from 'lucide-react';

export const ResourcesPage = () => {
  const { resources, addResource, updateResource, deleteResource, user } = useEventIQ();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modal States
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [allocatingResource, setAllocatingResource] = useState(null);
  const [resourceToDelete, setResourceToDelete] = useState(null);

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    name: '',
    category: 'Equipment',
    total: '',
    allocated: '',
    unit: 'units',
  });
  const [formErrors, setFormErrors] = useState({});

  // Form State for Quick Allocation Adjustment
  const [allocateValue, setAllocateValue] = useState('');
  const [allocateError, setAllocateError] = useState('');

  const categories = ['All', 'Staff', 'Venue', 'Equipment', 'Transport', 'Food', 'Budget'];

  // Category Icon Resolver
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Staff':
        return <Users className="w-4 h-4 text-brand-burgundy" />;
      case 'Venue':
        return <Building className="w-4 h-4 text-brand-ochre" />;
      case 'Transport':
        return <Truck className="w-4 h-4 text-brand-olive" />;
      case 'Food':
        return <Utensils className="w-4 h-4 text-brand-ochre" />;
      case 'Budget':
        return <DollarSign className="w-4 h-4 text-brand-olive" />;
      case 'Equipment':
      default:
        return <Package className="w-4 h-4 text-brand-burgundy" />;
    }
  };

  // Status Badge Resolver
  const getStatusVariant = (status) => {
    switch (status) {
      case 'Critical':
        return 'critical';
      case 'Warning':
        return 'warning';
      case 'Healthy':
      default:
        return 'success';
    }
  };

  // Filtered Resources
  const filteredResources = useMemo(() => {
    return resources.filter((res) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || res.name.toLowerCase().includes(q) || res.category.toLowerCase().includes(q);
      const matchesCategory = selectedCategory === 'All' || res.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [resources, searchQuery, selectedCategory]);

  // Overall Summary Metrics
  const summaryMetrics = useMemo(() => {
    const totalItems = resources.length;
    const criticalCount = resources.filter((r) => r.status === 'Critical').length;
    const warningCount = resources.filter((r) => r.status === 'Warning').length;
    const totalCap = resources.reduce((acc, r) => acc + (r.total || 0), 0);
    const totalAlloc = resources.reduce((acc, r) => acc + (r.allocated || 0), 0);
    const avgUtilization = totalCap > 0 ? Math.round((totalAlloc / totalCap) * 100) : 0;

    return { totalItems, criticalCount, warningCount, avgUtilization };
  }, [resources]);

  // Handlers for Add / Edit Modal
  const handleOpenAddModal = () => {
    setEditingResource(null);
    setFormData({
      name: '',
      category: 'Equipment',
      total: '',
      allocated: '0',
      unit: 'units',
    });
    setFormErrors({});
    setIsAddEditModalOpen(true);
  };

  const handleOpenEditModal = (res) => {
    setEditingResource(res);
    setFormData({
      name: res.name,
      category: res.category,
      total: String(res.total),
      allocated: String(res.allocated),
      unit: res.unit || 'units',
    });
    setFormErrors({});
    setIsAddEditModalOpen(true);
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Resource name is required.';
    const totalNum = Number(formData.total);
    if (!formData.total || isNaN(totalNum) || totalNum <= 0) {
      errs.total = 'Total quantity must be greater than 0.';
    }

    const allocNum = Number(formData.allocated);
    if (isNaN(allocNum) || allocNum < 0) {
      errs.allocated = 'Allocated quantity cannot be negative.';
    } else if (allocNum > totalNum) {
      errs.allocated = 'Allocated quantity cannot exceed total capacity.';
    }

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const totalNum = Number(formData.total);
    const allocNum = Number(formData.allocated);

    if (editingResource) {
      updateResource(editingResource.id, {
        name: formData.name.trim(),
        category: formData.category,
        total: totalNum,
        allocated: allocNum,
        unit: formData.unit || 'units',
      });
    } else {
      addResource({
        name: formData.name.trim(),
        category: formData.category,
        total: totalNum,
        allocated: allocNum,
        unit: formData.unit || 'units',
      });
    }

    setIsAddEditModalOpen(false);
  };

  // Handlers for Allocate Modal
  const handleOpenAllocateModal = (res) => {
    setAllocatingResource(res);
    setAllocateValue(String(res.allocated));
    setAllocateError('');
  };

  const handleAllocateSubmit = (e) => {
    e.preventDefault();
    const val = Number(allocateValue);
    if (isNaN(val) || val < 0) {
      setAllocateError('Allocation cannot be negative.');
      return;
    }
    if (val > allocatingResource.total) {
      setAllocateError(`Allocation cannot exceed total capacity (${allocatingResource.total} ${allocatingResource.unit}).`);
      return;
    }

    updateResource(allocatingResource.id, { allocated: val });
    setAllocatingResource(null);
  };

  const confirmDeleteResource = () => {
    if (resourceToDelete) {
      deleteResource(resourceToDelete.id);
      setResourceToDelete(null);
    }
  };

  return (
    <PageContainer maxWidth="7xl" className="space-y-6 pb-12 font-outfit">
      {/* Page Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <SectionHeading
          title="Resource Planning & Asset Inventory"
          subtitle="Track equipment, venues, staff allocations, catering, and logistical budget in real time."
          badge={<Badge variant="burgundy" size="sm">Live Inventory Store</Badge>}
        />
        <Button
          variant="primary"
          size="md"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={handleOpenAddModal}
          className="shrink-0"
        >
          Add Resource
        </Button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="metric" className="p-4 space-y-1 bg-brand-cream/50">
          <span className="text-xs font-semibold text-brand-warm-gray">Total Managed Assets</span>
          <div className="font-space-grotesk font-extrabold text-2xl text-brand-espresso">{summaryMetrics.totalItems}</div>
          <p className="text-[11px] text-brand-warm-gray">Across 6 operational categories</p>
        </Card>

        <Card variant="metric" className="p-4 space-y-1 bg-brand-cream/50">
          <span className="text-xs font-semibold text-brand-warm-gray">Average Utilization</span>
          <div className="font-space-grotesk font-extrabold text-2xl text-brand-espresso">{summaryMetrics.avgUtilization}%</div>
          <p className="text-[11px] text-brand-warm-gray">Allocated vs total capacity</p>
        </Card>

        <Card variant="metric" className="p-4 space-y-1 bg-brand-cream/50">
          <span className="text-xs font-semibold text-brand-warm-gray">Warning Level</span>
          <div className="font-space-grotesk font-extrabold text-2xl text-brand-ochre">{summaryMetrics.warningCount}</div>
          <p className="text-[11px] text-brand-warm-gray">Approaching 75% capacity</p>
        </Card>

        <Card variant="metric" className="p-4 space-y-1 bg-brand-cream/50">
          <span className="text-xs font-semibold text-brand-warm-gray">Critical Shortages</span>
          <div className="font-space-grotesk font-extrabold text-2xl text-brand-red">{summaryMetrics.criticalCount}</div>
          <p className="text-[11px] text-brand-warm-gray">Over 90% allocation limit</p>
        </Card>
      </div>

      {/* Filter Tabs & Search Bar */}
      <Card variant="standard" className="p-4 space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-[8px] text-xs font-bold transition-colors ${
                  selectedCategory === cat
                    ? 'bg-brand-burgundy text-brand-ivory shadow-subtle'
                    : 'bg-brand-cream text-brand-warm-gray hover:text-brand-espresso'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-warm-gray pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search resources by name..."
              className="w-full h-9 pl-9 pr-4 bg-brand-ivory border border-brand-beige rounded-[8px] text-xs font-outfit text-brand-espresso placeholder:text-brand-warm-gray focus:outline-none focus:border-brand-burgundy"
            />
          </div>
        </div>
      </Card>

      {/* Main Resources Table */}
      {filteredResources.length === 0 ? (
        <EmptyState
          icon={<Boxes className="w-6 h-6" />}
          title="No resources found"
          description="No resource entries matched your selected filter category or search query."
          action={
            <Button variant="secondary" size="sm" onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}>
              Reset Filters
            </Button>
          }
        />
      ) : (
        <Card variant="standard" className="p-0 overflow-hidden shadow-subtle border-brand-beige">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm font-outfit">
              <thead className="bg-brand-cream border-b border-brand-beige text-xs font-bold uppercase tracking-wider text-brand-espresso">
                <tr>
                  <th className="py-3.5 px-4">Resource Name</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4 font-space-grotesk">Total</th>
                  <th className="py-3.5 px-4 font-space-grotesk">Allocated</th>
                  <th className="py-3.5 px-4 font-space-grotesk">Available</th>
                  <th className="py-3.5 px-4">Utilization</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-beige/60 bg-brand-ivory text-brand-espresso">
                {filteredResources.map((res) => (
                  <tr key={res.id} className="hover:bg-brand-cream/40 transition-colors">
                    {/* Name */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-[6px] bg-brand-cream border border-brand-beige shrink-0">
                          {getCategoryIcon(res.category)}
                        </div>
                        <span className="font-bold text-brand-espresso">{res.name}</span>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <Badge variant="neutral" size="sm">
                        {res.category}
                      </Badge>
                    </td>

                    {/* Total */}
                    <td className="py-3.5 px-4 font-space-grotesk font-semibold text-brand-espresso">
                      {res.total} <span className="text-brand-warm-gray text-[11px] font-normal">{res.unit}</span>
                    </td>

                    {/* Allocated */}
                    <td className="py-3.5 px-4 font-space-grotesk font-semibold text-brand-burgundy">
                      {res.allocated} <span className="text-brand-warm-gray text-[11px] font-normal">{res.unit}</span>
                    </td>

                    {/* Available */}
                    <td className="py-3.5 px-4 font-space-grotesk font-semibold text-brand-olive">
                      {res.available} <span className="text-brand-warm-gray text-[11px] font-normal">{res.unit}</span>
                    </td>

                    {/* Utilization Progress Bar */}
                    <td className="py-3.5 px-4 min-w-[140px]">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] font-space-grotesk font-bold">
                          <span>{res.utilization}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-brand-cream rounded-full overflow-hidden border border-brand-beige/50">
                          <div
                            className={`h-full rounded-full ${
                              res.utilization >= 90
                                ? 'bg-brand-red'
                                : res.utilization >= 75
                                ? 'bg-brand-ochre'
                                : 'bg-brand-olive'
                            }`}
                            style={{ width: `${Math.min(100, res.utilization)}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <Badge variant={getStatusVariant(res.status)} size="sm" dot>
                        {res.status}
                      </Badge>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenAllocateModal(res)}
                          className="text-xs font-semibold text-brand-burgundy hover:bg-brand-burgundy-soft/30"
                        >
                          Allocate
                        </Button>
                        <IconButton
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenEditModal(res)}
                          ariaLabel="Edit resource"
                        >
                          <Edit className="w-4 h-4 text-brand-warm-gray hover:text-brand-burgundy" />
                        </IconButton>
                        <IconButton
                          variant="ghost"
                          size="sm"
                          onClick={() => setResourceToDelete(res)}
                          ariaLabel="Delete resource"
                          className="text-brand-red hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </IconButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Add / Edit Resource Modal */}
      <Modal
        isOpen={isAddEditModalOpen}
        onClose={() => setIsAddEditModalOpen(false)}
        title={editingResource ? 'Edit Resource Inventory' : 'Add New Resource'}
        description="Configure total capacity, current allocation, and categorization."
      >
        <form onSubmit={handleFormSubmit} className="space-y-4 pt-2 font-outfit" noValidate>
          <Input
            label="Resource Name"
            placeholder="e.g. Wireless Microphones & Receivers"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={formErrors.name}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Resource Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            >
              <option value="Staff">Staff</option>
              <option value="Venue">Venue</option>
              <option value="Equipment">Equipment</option>
              <option value="Transport">Transport</option>
              <option value="Food">Food</option>
              <option value="Budget">Budget</option>
            </Select>

            <Input
              label="Unit of Measure"
              placeholder="e.g. units, seats, buses, USD"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Total Capacity / Quantity"
              type="number"
              placeholder="100"
              value={formData.total}
              onChange={(e) => setFormData({ ...formData, total: e.target.value })}
              error={formErrors.total}
              required
            />

            <Input
              label="Allocated Quantity"
              type="number"
              placeholder="0"
              value={formData.allocated}
              onChange={(e) => setFormData({ ...formData, allocated: e.target.value })}
              error={formErrors.allocated}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-brand-beige">
            <Button variant="secondary" size="md" onClick={() => setIsAddEditModalOpen(false)} type="button">
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit">
              {editingResource ? 'Save Changes' : 'Add Resource'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Quick Allocate Modal */}
      <Modal
        isOpen={Boolean(allocatingResource)}
        onClose={() => setAllocatingResource(null)}
        title={`Allocate: ${allocatingResource?.name || ''}`}
        description="Update current allocation quantity to recalculate available inventory."
      >
        <form onSubmit={handleAllocateSubmit} className="space-y-4 pt-2 font-outfit">
          {allocatingResource && (
            <div className="p-3 bg-brand-cream/60 rounded-[8px] border border-brand-beige text-xs space-y-1">
              <p className="font-bold text-brand-espresso">Total Capacity: {allocatingResource.total} {allocatingResource.unit}</p>
              <p className="text-brand-warm-gray">Currently Allocated: {allocatingResource.allocated} {allocatingResource.unit}</p>
            </div>
          )}

          <Input
            label="New Allocation Quantity"
            type="number"
            value={allocateValue}
            onChange={(e) => {
              setAllocateValue(e.target.value);
              setAllocateError('');
            }}
            error={allocateError}
            required
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-brand-beige">
            <Button variant="secondary" size="md" onClick={() => setAllocatingResource(null)} type="button">
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit">
              Update Allocation
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(resourceToDelete)}
        onClose={() => setResourceToDelete(null)}
        title="Delete Resource Entry"
        description="Are you sure you want to delete this resource entry from inventory?"
      >
        <div className="space-y-4 pt-2 font-outfit">
          {resourceToDelete && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-[10px] text-xs">
              <p className="font-bold text-brand-red">{resourceToDelete.name}</p>
              <p className="text-brand-warm-gray">{resourceToDelete.category} • Total: {resourceToDelete.total} {resourceToDelete.unit}</p>
            </div>
          )}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-brand-beige">
            <Button variant="secondary" size="md" onClick={() => setResourceToDelete(null)}>
              Cancel
            </Button>
            <Button variant="danger" size="md" onClick={confirmDeleteResource} leftIcon={<Trash2 className="w-4 h-4" />}>
              Delete Resource
            </Button>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
};

export default ResourcesPage;

