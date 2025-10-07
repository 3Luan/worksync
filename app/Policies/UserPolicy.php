<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Support\Facades\Auth;

class UserPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function viewAny()
    {
        return in_array(Auth::user()->role, User::ROLES);
    }

    /**
     * Determine whether the user can view any models.
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function manageView()
    {
        return in_array(Auth::user()->role, [User::ROLE_ADMIN, User::ROLE_STAFF_ACCOUNTANT]);
    }

    /**
     * Determine whether the user can view any models.
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function view()
    {
        return in_array(Auth::user()->role, User::ROLE_MANAGEMENTS);
    }

    /**
     * Determine whether the user can create models.
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function create()
    {
        return in_array(Auth::user()->role, User::ROLE_MANAGEMENTS);
    }

    /**
     * Determine whether the user can update the model.
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function update()
    {
        return in_array(Auth::user()->role, User::ROLE_MANAGEMENTS);
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function delete()
    {
        return in_array(Auth::user()->role, User::ROLE_MANAGEMENTS);
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function restore()
    {
        return in_array(Auth::user()->role, User::ROLE_MANAGEMENTS);
    }

    /**
     * Determine whether user can checkin.
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function checkin()
    {
        return in_array(Auth::user()->role, User::ROLE_STAFF);
    }

    /**
     * Determine whether user can checkout.
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function checkout()
    {
        return in_array(Auth::user()->role, User::ROLE_STAFF);
    }

    /**
     * Determine whether user can start-break.
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function startBreak()
    {
        return in_array(Auth::user()->role, User::ROLE_STAFF);
    }

    /**
     * Determine whether the user can end-break.
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function endBreak()
    {
        return in_array(Auth::user()->role, User::ROLE_STAFF);
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function deleteTimeCard()
    {
        return in_array(Auth::user()->role, User::ROLE_STAFF);
    }

    /**
     * Determine whether the user can view any models.
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function adminView()
    {
        return Auth::user()->role === User::ROLE_ADMIN;
    }

    /**
     * Determine whether the user can view any models.
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function leaderView()
    {
        return Auth::user()->role === User::ROLE_STAFF_LEADER;
    }

    /**
     * Determine whether the user can view any models.
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function viewStaff()
    {
        return in_array(Auth::user()->role, [User::ROLE_STAFF_LEADER, User::ROLE_STAFF_ACCOUNTANT]);
    }


    /**
     * Determine whether the user can view any models.
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function staffView()
    {
        return in_array(Auth::user()->role, User::ROLE_STAFF);
    }

    /**
     * Check if the user can access calendar data by date.
     * @return bool
     */
    public function checkCalendar()
    {
        return in_array(Auth::user()->role, User::ROLES);
    }

    /**
     * Check if the user can export excel.
     * @return bool
     */
    public function exportExcel()
    {
        return in_array(Auth::user()->role, User::ROLES);
    }

    /**
     * Check if the user can export pdf.
     * @return bool
     */
    public function exportPdf()
    {
        return in_array(Auth::user()->role, User::ROLES);
    }

    /**
     * Check if the user can export excel zip.
     * @return bool
     */
    public function exportExcelManageRole()
    {
        return in_array(Auth::user()->role, [...User::ROLE_MANAGEMENTS, User::ROLE_STAFF_ACCOUNTANT]);
    }

    /**
     * Check if the user can export pdf zip.
     * @return bool
     */
    public function exportPdfZip()
    {
        return in_array(Auth::user()->role, [...User::ROLE_MANAGEMENTS, User::ROLE_STAFF_ACCOUNTANT]);
    }

    /**
     * Check if the user can get overview.
     * @return bool
     */
    public function overview()
    {
        return Auth::user()->role === User::ROLE_ADMIN;
    }
}
