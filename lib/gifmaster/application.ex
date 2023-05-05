defmodule Gifmaster.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      # Start the Telemetry supervisor
      GifmasterWeb.Telemetry,
      # Start the Ecto repository
      Gifmaster.Repo,
      # Start the PubSub system
      {Phoenix.PubSub, name: Gifmaster.PubSub},
      # Start Finch
      {Finch, name: Gifmaster.Finch},
      # Start the Endpoint (http/https)
      GifmasterWeb.Endpoint
      # Start a worker by calling: Gifmaster.Worker.start_link(arg)
      # {Gifmaster.Worker, arg}
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: Gifmaster.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    GifmasterWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
